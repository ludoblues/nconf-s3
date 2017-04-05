const aws = require('aws-sdk');
const nconf = require('nconf');

const Memory = nconf.Memory;

class S3Plugin extends Memory {
  constructor(options = {}) {
    if (!options.bucket) {
      throw new Error('a S3 Bucket has to be provided');
    }

    super();

    this.type = 'S3';
    this.bucket = options.bucket;
    this.key = options.key || 'config.json';
    this.format = options.format || nconf.formats.json;
    
    this.loadSync = undefined;
  }

  load(callback) {
    const s3 = new aws.S3();
    const params = { Bucket: this.bucket, Key: this.key };

    s3.getObject(params, (err, s3Conf) => {
      if (err) {
        return callback(err);
      }

      this.store = this.format.parse(s3Conf.Body.toString());

      callback(null, this.store);
    });
  }
}

nconf.S3 = S3Plugin;
