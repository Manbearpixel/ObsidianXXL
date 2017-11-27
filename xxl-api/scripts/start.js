#!/usr/bin/env node

const { exec }  = require('child_process');
const Port      = process.env.PORT || 4201;
const NodeEnv   = process.env.NODE_ENV || 'development';
const OdnDebug  = process.env.ODN_DEBUG || 'false';

exec(`NODE_ENV=${NodeEnv} ODN_DEBUG=${OdnDebug} PORT=${Port} node ./bin/www`, (err, stdout, stderr) => {

  // node couldn't execute the command
  if (err) {
    console.log('ERROR: Unable to start ObsidianXXL-API');
    return;
  }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  console.log(':// ObsidianXXL-API [Started]');
});
