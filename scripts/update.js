#!/usr/bin/env node

const { exec } = require('child_process');

exec(`git pull && npm install`, (err, stdout, stderr) => {

  // node couldn't execute the command
  if (err) {
    console.log('ERROR: Unable to update ObsidianXXL');
    console.log(err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  console.log(':// ObsidianXXL [Updated]');
});
