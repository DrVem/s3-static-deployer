const fs = require('fs');
const minimatch = require('minimatch');
const mime = require('mime');

const matches = (path, pattern) =>
  minimatch(path, pattern, { matchBase: true });

const customHeadersByGlob = (headers, path) =>
  Object.keys(headers).reduce((acc, pattern) =>
    matches(path, pattern) ?
      Object.assign(acc, headers[pattern]) :
      acc, {});

const createDefaultHeaders = (path) => ({
  'Content-Type': mime.lookup(path),
  'Content-Length': fs.statSync(path).size
})

exports.createFileMetadata = (src, headers) => (path) => ({
  path,
  output: path.replace(new RegExp(`^${src}`), ''),
  headers: Object.assign(
    customHeadersByGlob(headers, path),
    createDefaultHeaders(path)
  )
});
