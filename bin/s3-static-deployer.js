#!/usr/bin/env node
const yargs = require('yargs');
const { red } = require('chalk');
const fs = require('fs');

const options = {
  config: {
    alias: 'c',
    describe: 'Deployer configuration file',
    demand: true
  },
  bucket: {
    alias: 'b',
    describe: 'S3 bucket name',
    demand: true
  },
  region: {
    alias: 'r',
    describe: 'S3 bucket region',
    default: 'sa-east-1',
    demand: true
  },
  src: {
    alias: 's',
    describe: 'Directory to deploy',
    type: 'string',
    demand: true
  }
}

const argv = yargs
  .version(() => require('../package.json').version)
  .usage('$0 --config <file> --bucket <bucketName> --src <dir>')
  .example('$0 --config .deployer.json --bucket drvem --src ./public')
  .options(options)
  .wrap(Math.min(100, yargs.terminalWidth()))
  .strict()
  .help()
  .argv;

fs.readFile(argv.config, (err, data) => {
  if (err) {
    console.log(red(`Configuration not found at ${argv.config}`));
    process.exit(1);
  }

  const config = JSON.parse(data);
  const awsConfig = Object.assign({}, config.aws, {
    region: argv.region,
    bucket: argv.bucket
  });

  require('../lib')(awsConfig, {
    src: argv.src,
    headers: config.headers
  });
});

