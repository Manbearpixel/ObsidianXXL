#!/usr/bin/env node

const inquirer  = require('inquirer');
const fs        = require('fs');
const System    = require('systeminformation');
const { exec }  = require('child_process');

let xxlAPIConfigPath = './config/';
let xxlAPIConfigFile = `${xxlAPIConfigPath}production.json`;

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
  inquirer.prompt(configQuestions).then(answers => {
    console.log('...generating configuation file');
    const PgConfig = {
      "Database": {
        "config": {
          "host":       "localhost",
          "port":       "5432",
          "username":   answers.pg_username,
          "password":   answers.pg_password,
          "dbName":     answers.pg_database_name
        },
        "options": {
          "dialect": "postgres"
        }
      }
    };
    const PgConfigStr = JSON.stringify(PgConfig, null, '  ');

    inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: `About to write to ${xxlAPIConfigFile}:\n${PgConfigStr}\n\nThese values can be modified or accessed in the future.\nContinue with config file save? (yes)`
    }).then(confirmation => {
      if (confirmation.confirm === false) {
        console.log('Aborted.');
        return false;
      }

      fs.writeFile(xxlAPIConfigFile, PgConfigStr, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }

        console.log("The file was saved!");
        console.log(":// ObsidianXXL Postgres Configuration File Saved -- Please backup passwords for safe keeping!\n\n");

        createPostgresUser(PgConfig.Database.config.username, PgConfig.Database.config.password, PgConfig.Database.config.dbName);
      });
    });
  });
};

let genericPostgresIssue = (err) => {
  console.log('ERROR: Something unexpected happened and we could not create the necessary Postgres details at this time. Please report this error so we can provide better coverage in the future.');
  console.log(`Error Details: ${err.message}\n\n---`);
}

// Setup PG User on supported environments...
// Currently supported: Mac, Ubuntu
let createPostgresUser = (pg_username, pg_password, pg_database_name) => {
  console.log(':// ObsidianXXL Setup');
  console.log(`:// Setup Postgres User [${pg_username}]...\n`);

  const psqlDropUser = `"DROP ROLE IF EXISTS ${pg_username};"`;
  const psqlCreateUser = `"CREATE ROLE ${pg_username} WITH LOGIN PASSWORD '${pg_password}';"`;
  const psqlAlterRoleLogin = `"ALTER ROLE ${pg_username} WITH LOGIN;"`;

  let psql = '';
  System.osInfo()
  .then((OS) => {
    if (/mac/ig.test(OS.distro) === true) {
      psql = 'psql -c';
    }
    else if (/ubuntu/ig.test(OS.distro) === true) {
      psql = 'sudo -u postgres psql -c';
    }
    else {
      return genericPostgresIssue(new Error(`Unsupported Environment: '${OS.distro}'`));
    }

    console.log('Creating...');
    exec(`${psql} ${psqlDropUser}`, (err, stdout, stderr) => {
      if (err) {
        return genericPostgresIssue(err);
      }

      exec(`${psql} ${psqlCreateUser}`, (err, stdout, stderr) => {
        if (err) {
          return genericPostgresIssue(err);
        }

        exec(`${psql} ${psqlAlterRoleLogin}`, (err, stdout, stderr) => {
          if (err) {
            return genericPostgresIssue(err);
          }

          console.log('...Done!');
          console.log(`Postgres user '${pg_username}' has been created and can login!\n\n`);

          createPostgresDatabase(pg_database_name, pg_username);
        });
      });
    });
  });
};

// Setup PG User on supported environments...
// Currently supported: Mac, Ubuntu
let createPostgresDatabase = (pg_database_name, pg_username) => {
  console.log(':// ObsidianXXL Setup');
  console.log(`:// Setup Postgres Database [${pg_database_name}]...\n`);

  const psqlDropDatabase = `"DROP DATABASE IF EXISTS ${pg_database_name};"`;
  const psqlCreateDatabase = `"CREATE DATABASE ${pg_database_name} OWNER ${pg_username};"`;


  let psql = '';
  System.osInfo()
  .then((OS) => {
    if (/mac/ig.test(OS.distro) === true) {
      psql = 'psql -c';
    }
    else if (/ubuntu/ig.test(OS.distro) === true) {
      psql = 'sudo -u postgres psql -c';
    }
    else {
      return genericPostgresIssue(new Error(`Unsupported Environment: '${OS.distro}'`));
    }

    console.log('Creating...');
    exec(`${psql} ${psqlDropDatabase}`, (err, stdout, stderr) => {
      if (err) {
        return genericPostgresIssue(err);
      }

      exec(`${psql} ${psqlCreateDatabase}`, (err, stdout, stderr) => {
        if (err) {
          return genericPostgresIssue(err);
        }

        console.log('...Done!');
        console.log(`Postgres database '${pg_database_name}' has been created!\n\n`);

        completePostgresSetup();
      });
    });
  });
};

let completePostgresSetup = () => {
  console.log(':// ObsidianXXL Setup Complete!');
  console.log('The Postgres Config file has been generated and the PG_USER and PG_DB have been created!\n\n');
};

// TODO: Make work >:(
let runMigrations = () => {
  exec(`cd ./xxl-api && sequelize db:migrate`, (err, stdout, stderr) => {
    if (err) {
      console.log('ERROR HAPPENED');
      console.log(err.message);
      console.log(stderr);
      return false;
    }

    console.log('GOOD STUFF');
    console.log(stdout);
  });
};

console.log(':// ObsidianXXL Setup');
console.log(':// Setup Postgres Database...\n');
if (fs.existsSync(xxlAPIConfigFile)) {
  inquirer.prompt({
    type:     'confirm',
    name:     'confirm',
    message:  `A database configuration file already exists at '${xxlAPIConfigFile}'...\n  Are you sure you would like to overwrite and create a new one?`
  }).then(confirmation => {
    if (confirmation.confirm === true) {
      return configPrompt();
    }
    console.log('Aborted.');
    return false;
  });
}
else {
  configPrompt();
}
