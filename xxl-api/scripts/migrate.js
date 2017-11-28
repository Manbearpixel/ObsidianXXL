#!/usr/bin/env node

const { exec }  = require('child_process');

console.log('Starting ObsidianXXL-API Migration...');
exec(`sequelize db:migrate`, (err, stdout, stderr) => {

  // node couldn't execute the command
  if (err) {
    console.log('ERROR: Unable to start Migrate ObsidianXXL-API');
    console.log(err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  console.log(':// ObsidianXXL-API Migration Successful');
});
