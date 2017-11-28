#!/usr/bin/env node

/***
  Super-awesome-Postgres-Setup-via-Node! v0.1.0
  == Suppoted environments:
  > Mac OS
  > Ubuntu

  == Requires:
  > NodeJS
  > NPM
  > Sequelize
  > systeminformation
  > inquirer

  == Available via:
  > Node --> node ./scripts/setup.js
  > NPM --> npm run setup

  This sets up the proper sequelize config file for any environment; defaults
  to 'production'. Uses the NODE_ENV variable to determine which env to setup.

  This setup will guide the user through easy input and confirmation prompts to
  set the postgres user/role, database, and run migrations. It will run safety
  checks and verify:

  - Config file already exists?
    -> throw Overwrite prompt
  - User/Role already exists?
    -> throw Change password prompt
  - Database already exists?
    -> throw Drop database prompt

  Any errors will bubble up and be sent to the console where the user is
  directed to report it to the dev team to handle.
***/

const Inquirer  = require('inquirer');
const fs        = require('fs');
const System    = require('systeminformation');
const Sequelize = require('sequelize');
const { exec }  = require('child_process');

const NodeEnv   = process.env.NODE_ENV || 'production';

let xxlAPIConfigPath = './config/';
let xxlAPIConfigFile = `${xxlAPIConfigPath}${NodeEnv}.json`;

let configQuestions = [
  {
    type:     'input',
    name:     'pg_database_name',
    message:  'Please enter a Database Name',
    default: function() {
      return 'odn_beta';
    },
    validate: function(value) {
      if (value.length > 3) {
        return true;
      }
      return 'Database name should be > 3 characters';
    }
  },
  {
    type:     'input',
    name:     'pg_username',
    message:  'Please enter a Username',
    default: function() {
      return 'odnxxl';
    },
    validate: function(value) {
      if (value.length > 3) {
        return true;
      }
      return 'Username name should be > 3 characters';
    }
  },
  {
    type:     'input',
    name:     'pg_password',
    message:  'Please enter a Password',
    validate: function(value) {
      if (value.length > 3) {
        return true;
      }
      return 'Password name should be > 3 characters';
    }
  }
];

let configPrompt = () => {
  Inquirer.prompt(configQuestions).then(answers => {
    console.log('...generating configuation file');
    const PgConfig = {
      "host":     "127.0.0.1",
      "port":     "5432",
      "dialect":  "postgres",
      "username": answers.pg_username,
      "password": answers.pg_password,
      "database": answers.pg_database_name
    };
    const PgConfigStr = JSON.stringify(PgConfig, null, '  ');

    Inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: `About to write to ${xxlAPIConfigFile}:\n${PgConfigStr}\n\nThese values CAN BE modified or accessed in the future.\nPassword can be changed by running this setup again.\nContinue with config file save? (yes)`
    }).then(confirmation => {
      if (confirmation.confirm === false) {
        console.log('Aborted.');
        return false;
      }

      fs.writeFile(xxlAPIConfigFile, PgConfigStr, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }

        console.log("\n:// ObsidianXXL Postgres Configuration File Saved -- Please backup passwords for safe keeping!");

        createDatabase(PgConfig)
        .then((success) => {
          upsertPostgresUser(PgConfig)
          .then((success) => {
            runMigrations();
          })
          .catch((err) => {
            genericPostgresIssue(err);
            console.log(err);
          });
        })
        .catch((err) => {
          genericPostgresIssue(err);
          console.log(err);
        });
      });
    });
  });
};

let genericPostgresIssue = (err) => {
  console.log('ERROR: Something unexpected happened and we could not create the necessary Postgres details at this time. Please report this error so we can provide better coverage in the future.');
  console.log(`Details: ${err.message}\n--- --- ---`);
}

// Determine the proper Postgres --command to use in the shell
let psqlCommand = () => {
  return new Promise((resolve, reject) => {
    System.osInfo()
    .then((OS) => {
      if (/mac/ig.test(OS.distro) === true) {
        resolve('psql -c');
      }
      else if (/ubuntu/ig.test(OS.distro) === true) {
        resolve('sudo -u postgres psql -c');
      }
      else {
        reject(new Error(`Unsupported Environment: '${OS.distro}'`));
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
};

// Grabs current roles "users" within postgres
let grabAvailableRoles = () => {
  const psqlGetRoles = `"SELECT rolname FROM pg_roles;"`;

  return new Promise((resolve, reject) => {
    psqlCommand()
    .then((psql) => {
      exec(`${psql} ${psqlGetRoles} -A -t`, (err, stdout, stderr) => {
        if (err) {
          // console.log(err);
          return reject(new Error(`Unable to grab current Postgres Roles ... ${err.message}`));
        }
        return resolve(stdout.split('\n'));
      });
    })
    .catch(reject);
  });
};

// Returns true/false if a passed username exists within the current Postgres env
let userExists = (username) => {
  return new Promise((resolve, reject) => {
    grabAvailableRoles()
    .then((Roles) => {
      if (Roles.indexOf(username) != -1) {
        return resolve(true);
      }
      else {
        return resolve(false);
      }
    })
    .catch(reject);
  });
};

// Grabs all databases in current postgres env
let grabAvailableDatabases = () => {
  const psqlGetRoles = `"SELECT datname FROM pg_database;"`;

  return new Promise((resolve, reject) => {
    psqlCommand()
    .then((psql) => {
      exec(`${psql} ${psqlGetRoles} -A -t`, (err, stdout, stderr) => {
        if (err) {
          // console.log(err);
          return reject(new Error(`Unable to grab current Databases ... ${err.message}`));
        }
        return resolve(stdout.split('\n'));
      });
    })
    .catch(reject);
  });
};

// Returns true/false if a passed username exists within the current Postgres env
let databaseExists = (database) => {
  return new Promise((resolve, reject) => {
    grabAvailableDatabases()
    .then((Databases) => {
      if (Databases.indexOf(database) != -1) {
        return resolve(true);
      }
      else {
        return resolve(false);
      }
    })
    .catch(reject);
  });
};

// Check to see if the passed username / role exists within postgres env...
// Will prompt user to either update the password if exists OR
// Create the user if not exists
let upsertPostgresUser = (PgConfig) => {
  console.log('\n...\n');
  console.log(':// ~ ObsidianXXL Setup ~');
  console.log(`:// Setup Postgres User [${PgConfig.username}] ...`);

  return new Promise((resolve, reject) => {
    userExists(PgConfig.username)
    .then((exists) => {
      if (exists) {
        console.log('');
        Inquirer.prompt({
          type: 'confirm',
          name: 'confirm',
          message: `The user '${PgConfig.username}' already exists.\n  Would you like to change the password to the one you have provided? (yes)`
        }).then(confirmation => {
          if (confirmation.confirm === true) {
            changeUserPassword(PgConfig.username, PgConfig.password)
            .then((changed) => {
              console.log('\n:// Password updated!');
              resolve(true);
            })
            .catch(reject);
          }
          else {
            console.log('\n:// Aborted!');
            console.log(':// Username and password HAVE NOT been altered. Please make sure the config file has the correct password for proper authentication!');
            resolve(true);
          }
        });
      }
      else {
        createUser(PgConfig.username, PgConfig.password, PgConfig.database)
        .then((created) => {
          console.log('\n:// User created!');
          resolve(true);
        })
        .catch(reject);
      }
    })
    .catch(reject);
  });
};

// Change a user / role with a supplied password
let changeUserPassword = (username, password) => {
  const psqlChangePassword = `"ALTER ROLE ${username} WITH PASSWORD '${password}';"`;

  return new Promise((resolve, reject) => {
    psqlCommand()
    .then((psql) => {
      exec(`${psql} ${psqlChangePassword}`, (err, stdout, stderr) => {
        if (err) {
          // console.log(err);
          return reject(new Error(`ERROR: Could not change password for '${username}' ... ${err.message}`));
        }
        return resolve(true);
      });
    })
    .catch(reject);
  });
};

// Create a user / role with supplied information
// Also ensures user/role can login
let createUser = (username, password, database) => {
  const psqlCreateUser = `"CREATE ROLE ${username} WITH LOGIN PASSWORD '${password}';"`;
  const psqlAlterRoleLogin = `"ALTER ROLE ${username} WITH LOGIN;"`;
  const psqlGrantPermissions = `"GRANT ALL PRIVILEGES ON DATABASE ${database} to ${username};"`;

  return new Promise((resolve, reject) => {
    psqlCommand()
    .then((psql) => {

      // First create the user
      exec(`${psql} ${psqlCreateUser}`, (err, stdout, stderr) => {
        if (err) {
          // console.log(err);
          return reject(new Error(`ERROR: Could not create user '${username}' ... ${err.message}`));
        }

        // Then alter the user role to have the 'login' ability
        exec(`${psql} ${psqlAlterRoleLogin}`, (err, stdout, stderr) => {
          if (err) {
            // console.log(err);
            return reject(new Error(`ERROR: Could not alter user '${username}' for logging in ... ${err.message}`));
          }

          // Finally make sure user has permissions
          exec(`${psql} ${psqlGrantPermissions}`, (err, stdout, stderr) => {
            if (err) {
              // console.log(err);
              return reject(new Error(`ERROR: Could not grant user '${username}' permissions ... ${err.message}`));
            }
            return resolve(true);
          });
        });
      });
    })
    .catch(reject);
  });
};

let createDatabase = (PgConfig) => {
  console.log('\n...\n');
  console.log(':// ~ ObsidianXXL Setup ~');
  console.log(`:// Setup Postgres Database [${PgConfig.database}] ...\n`);

  const psqlCreateDatabase = `"CREATE DATABASE ${PgConfig.database} OWNER ${PgConfig.username};"`;
  const psqlDropDatabase = `"DROP DATABASE IF EXISTS ${PgConfig.database};"`

  let createDb = () => {
    return new Promise((resolve, reject) => {
      psqlCommand()
      .then((psql) => {
        exec(`${psql} ${psqlCreateDatabase}`, (err, stdout, stderr) => {
          if (err) {
            // console.log(err);
            return reject(new Error(`ERROR: Could not create database '${PgConfig.database}' ... ${err.message}`));
          }
          return resolve(true);
        });
      })
      .catch(reject);
    });
  };

  let dropDb = () => {
    return new Promise((resolve, reject) => {
      psqlCommand()
      .then((psql) => {
        exec(`${psql} ${psqlDropDatabase}`, (err, stdout, stderr) => {
          if (err) {
            // console.log(err);
            return reject(new Error(`ERROR: Could not create database '${PgConfig.database}' ... ${err.message}`));
          }
          return resolve(true);
        });
      })
      .catch(reject);
    });
  };

  return new Promise((resolve, reject) => {
    databaseExists(PgConfig.database)
    .then((exists) => {
      if (exists) {
        console.log('');
        Inquirer.prompt({
          type: 'confirm',
          name: 'confirm',
          message: `The database '${PgConfig.database}' already exists.\n  Would you like to drop this database and create it again?\n  Doing this will remove ALL data currently stored! (yes)`
        }).then(confirmation => {
          if (confirmation.confirm === true) {
            dropDb(PgConfig.database)
            .then((dropped) => {
              console.log(`\n:// Dropping Database '${PgConfig.database}'...`);
              createDb()
              .then((created) => {
                console.log(`\n:// Database '${PgConfig.database}' created!`);
                resolve(true);
              }).catch(reject);
            }).catch(reject);
          }
          else {
            console.log('\n:// Aborted.');
            console.log(':// Database HAS NOT been dropped.');
            resolve(true);
          }
        });
      }
      else {
        createDb()
        .then((created) => {
          console.log(`\n:// Database '${PgConfig.database}' created!`);
          resolve(true);
        }).catch(reject);
      }
    })
    .catch(reject);
  });
};

let completePostgresSetup = () => {
  console.log(':// ObsidianXXL Setup Complete!');
  console.log('The Postgres Config file has been generated and the PG_USER and PG_DB have been created!\n\n');
};

let runMigrations = () => {
  console.log('\n...\n');
  console.log(':// ~ ObsidianXXL Setup ~');
  console.log(`:// Run API Migrations ...\n`);

  exec(`NODE_ENV=${NodeEnv} sequelize db:migrate`, (err, stdout, stderr) => {
    if (err) {
      return genericPostgresIssue(err);
      return false;
    }

    console.log('\n ... \n ... ... Done!\n');
    console.log(`\n:// ObsidianXXL-API has been successfully setup for '${NodeEnv}'!\n`);
  });
};


console.log('\n:// ~ ObsidianXXL Setup ~');
console.log(`:// Setting up for Environment: '${NodeEnv}' ...\n`);
if (fs.existsSync(xxlAPIConfigFile)) {
  Inquirer.prompt({
    type:     'confirm',
    name:     'confirm',
    message:  `A database configuration file already exists at '${xxlAPIConfigFile}'...\n  Are you sure you would like to overwrite and create a new one?`
  }).then(confirmation => {
    if (confirmation.confirm === true) {
      return configPrompt();
    }
    console.log('\nSetup Aborted.');
    return false;
  });
}
else {
  configPrompt();
}
