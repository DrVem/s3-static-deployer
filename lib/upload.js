const fs = require('fs');
const { red, green } = require('chalk');

exports.upload = (s3Client) => ({ path, output, headers }) => {
  const stream = fs.createReadStream(path);

  s3Client.putStream(stream, output, headers, (err, res) => {
    if (err || res.statusCode !== 200) {
      console.log(red(`[ERROR] - ${path} => ${output}`));
    } else {
      console.log(green(`[SUCCESS] - ${path} => ${output}`));
      res.resume();
    }
  });
};
