#!/usr/bin/env node

const { exec }  = require('child_process');
const Port      = process.env.PORT || 4201;
const NodeEnv   = process.env.NODE_ENV || 'development';
const OdnDebug  = process.env.ODN_DEBUG || 'false';

console.log(`:// ObsidianXXL-API [Starting] ... Listening on :${Port}`);
if (OdnDebug == 'true') {
  console.log('[x] Debug Mode Activen\n');
}
console.log('-- This is an active process, use ^C to terminate --');

exec(`NODE_ENV=${NodeEnv} ODN_DEBUG=${OdnDebug} PORT=${Port} node ./bin/www`);
