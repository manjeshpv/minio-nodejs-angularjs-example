
var fsp = require('fs-promise');
var Bluebird = require('bluebird');
var MinioClient = require('minio');

var config = require('../config');
const logger = console.log;

const Minio = new MinioClient(config.minio)

Bluebird.promisifyAll(Object.getPrototypeOf(Minio));


// Check whether object matchs with S3 object naming conventions
// http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html
// In my use case:
// 1. removing / at begining
// 2. lowercase
function qualifyObject(bucketName) {
  let bucket = bucketName;
  if (typeof bucket === 'string' && bucket[0] === '/') {
    bucket = bucket.slice(1);
  }
  return bucket.toLowerCase();
}

/**
 * https://docs.minio.io/docs/javascript-client-api-reference#putObject
 * Upload buffer using Minio.putObject
 * @param  {Object} minioObject
 * @param  {string} [minioObject.bucket]  Minio Bucket | optional | default:
 * @param  {string} minioObject.object    Object Name to Save
 * @param  {buffer} minioObject.buffer    Buffer to Store
 * @return {Promise.<string>}             returns etag of the object uploaded.
 */

Minio.bufferUpload = (minioObject) => {
  const minObj = minioObject;
  minObj.bucket = minObj.bucket || 'default';  // Bucket name always in lowercaseObj
  // - https://docs.minio.io/docs/javascript-client-api-reference#putObject
  return Minio.putObjectAsync(minObj.bucket, minObj.object,
    minObj.buffer, 'application/octet-stream');
}

/**
 * https://docs.minio.io/docs/javascript-client-api-reference#putObject
 * Upload base64 String using Minio.putObject
 * @param  {Object} minioObject
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.object        Object Name to Save
 * @param  {string} minioObject.base64String  Base64 String to Store
 * @return {Promise.<string>}                 returns etag of the object uploaded.
 */

Minio.base64Upload = (minioObject) => {
  const minObj = minioObject;
  minObj.buffer = Buffer.from(minioObject.base64String, 'base64');
  return Minio.bufferUpload(minObj);
}

/**
 * https://docs.minio.io/docs/javascript-client-api-reference#putObject
 * Upload base64 String using Minio.putObject
 * @param  {Array} minioObjects               Array of Base Minio Objects to Upload
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.object        Object Name to Save
 * @param  {string} minioObject.base64String  Base64 String to Store
 * @return {Promise.<Array>}                 returns Array of etag of the object uploaded.
 */

Minio.base64UploadMulti = (minioObjects) => {
  return Promise.all(minioObjects.map(m => Minio.base64Upload(m)));
}


/**
 * https://docs.minio.io/docs/javascript-client-api-reference#presignedGetObject
 * Generate Link to download or view object or file stored in Minio
 * @param minioObject
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.object        Object Name for Download URL Generation
 * @param  {number} minioObject.expires       Time for Link Expiry
 * @returns {Promise.<Array>}                 returns link to download or view file.
 * In my case: Mostly PDF
 */

Minio.viewLink = (minioObject) => {
  const minObj = minioObject;
  minObj.bucket = minObj.bucket || 'default';   // Bucket name always in lowercaseObj
  minObj.expires = minObj.expires || 24 * 60 * 60;   // Expired in one day
  if (!minObj.object) {
    logger.error('Minio: View File not found', minObj)
    return Promise.resolve(`${config.PREFIX}api.${config.DOMAIN}/api/404.pdf`);
  }
  return Minio.statObjectAsync(minObj.bucket, qualifyObject(minObj.object))
    .then(() => Minio
      .presignedGetObjectAsync(minObj.bucket, qualifyObject(minObj.object), minObj.expires))
    .catch(() => {
      logger.error('Minio: View File not found', minObj)
      return `${config.PREFIX}api.${config.DOMAIN}/api/404.pdf`;
    });
}

/**
 * https://docs.minio.io/docs/javascript-client-api-reference#presignedGetObject
 * Generate Link with content-disposition header. Force download minio object
 * @param minioObject
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.object        Object Name for Download URL Generation
 * @param  {number} minioObject.expires       Time for Link Expiry
 * @returns {Promise.<Array>}                 returns link to download or view file.
 */

Minio.downloadLinkBase = (minioObject) => {
  const minObj = minioObject;
  minObj.bucket = minObj.bucket || 'default';   // Bucket name always in lowercaseObj
  minObj.expires = minObj.expires || 24 * 60 * 60;   // Expired in one day
  minObj.headers = {
    'response-content-disposition':
      `attachment; filename="${minObj.name.replace(/[^a-zA-Z0-9-_\.]/g, '')}"` };
  return Minio.presignedGetObjectAsync(
    minObj.bucket.toLowerCase(), qualifyObject(minObj.object),
    minObj.expires, minObj.headers
  );
};

/**
 * https://docs.minio.io/docs/javascript-client-api-reference#presignedGetObject
 * Generate Link with content-disposition header. Force download minio object
 * https://docs.minio.io/docs/javascript-client-api-reference#statObject
 * Check whether file exist in Minio
 * @param minioObject
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.object        Object Name for Download URL Generation
 * @param  {number} minioObject.expires       Time for Link Expiry
 * @returns {Promise.<Array>}                 returns link to download or view file.
 */

Minio.downloadLink = (minioObject) => {
  const minObj = minioObject;
  minObj.bucket = minObj.bucket || 'default';   // Bucket name always in lowercase
  return Minio.statObjectAsync(minObj.bucket, qualifyObject(minObj.object))
    .then(() => Minio.downloadLinkBase(minObj))
    .catch(() => {
      logger.error('Minio: File not found', minObj)
      return `${config.PREFIX}api.${config.DOMAIN}/api/404.pdf`;
    });
};


/**
 * https://docs.minio.io/docs/javascript-client-api-reference#presignedPostPolicy
 * Generate Presigned Link to Upload file directly to Minio.
 * @param minioObject
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.object        Object Name for Download URL Generation
 * @param  {number} minioObject.expires       Time for Link Expiry
 * @returns {Promise.<string>}                 returns http url to upload file using HTTP POST.
 */

Minio.uploadLink = (minioObject) => {
  const minObj = minioObject;
  minObj.bucket = minObj.bucket || 'default';   // Bucket name always in lowercaseObj
  minObj.expires = minObj.expires || 24 * 60 * 60;   // Expired in one day
  return Minio.presignedPostObjectAsync(
    minObj.bucket, qualifyObject(minObj.object), minObj.expires);
};

/**
 * https://docs.minio.io/docs/javascript-client-api-reference#putObject
 * Transfer file from temp to Minio using Minio.putObject()
 * @param minioObject
 * @param  {string} [minioObject.bucket]      Minio Bucket | optional | default:
 * @param  {string} minioObject.temp          temporary file path.
 * @param  {string} minioObject.object        Object Name for Download URL Generation
 * @returns {Promise.<string>}                returns etag of the object uploaded
 */

Minio.uploadTemp = (minioObject) => {
  const minObj = minioObject;
  const fileStream = fsp.createReadStream(minioObject.temp)
  return fsp.stat(minioObject.temp).then(stats => Minio
    .putObjectAsync('default', minObj.object, fileStream, stats.size, 'application/octet-stream'));
}

module.exports  = Minio;