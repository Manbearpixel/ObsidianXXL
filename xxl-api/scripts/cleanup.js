#!/usr/bin/env node

const { exec }  = require('child_process');

console.log('Starting ObsidianXXL-API Database Cleanup...');
exec(`sequelize db:migrate:undo:all`, (err, stdout, stderr) => {

  // node couldn't execute the command
  if (err) {
    console.log('ERROR: Unable to clean ObsidianXXL-API database');
    return;
  }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  console.log(':// ObsidianXXL-API Database Cleanup Successful');
});
