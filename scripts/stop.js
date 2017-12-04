#!/usr/bin/env node

const { exec }  = require('child_process');
const UID       = 'obsidian-xxl';

exec(`forever stop ${UID}`, (err, stdout, stderr) => {

  // node couldn't execute the command
  if (err) {
    console.log('ERROR: Unable to stop ObsidianXXL');
    return;
  }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  console.log(':// ObsidianXXL [Stopped]');
});
