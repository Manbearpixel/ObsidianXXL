#!/usr/bin/env node

const { exec }  = require('child_process');
const Port      = process.env.PORT || 80;
const ConfigDir = process.env.CONFIG_DIR || './xxl-api/config';
const NodeEnv   = process.env.NODE_ENV || 'production';
const UID       = 'obsidian-xxl';

exec(`PORT=${Port} NODE_CONFIG_DIR=${ConfigDir} NODE_ENV=${NodeEnv} forever start -a --uid=${UID} server.js`, (err, stdout, stderr) => {

  // node couldn't execute the command
  if (err) {
    console.log('ERROR: Unable to start ObsidianXXL');
    return;
  }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  console.log(':// ObsidianXXL [Started]');
});
