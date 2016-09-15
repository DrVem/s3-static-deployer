const knox = require('knox');
const glob = require('glob');
const { failOnMissingArg } = require('../utils/args');
const { createFileMetadata } = require('./metadata');
const { upload } = require('./upload');

module.exports = (awsConfig, opts) => {
  failOnMissingArg(opts.src, 'opts.src');

  const client = knox.createClient(awsConfig);
  const headers = opts.headers || {};

  glob(`${opts.src}/**/*`, { nodir: true }, (err, files) => {
    files.map(createFileMetadata(opts.src, headers))
      .forEach(upload(client))
  });
};
