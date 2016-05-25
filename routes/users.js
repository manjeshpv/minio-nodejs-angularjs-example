var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var Minio = require('minio')
  var s3Client = new Minio({
    endPoint:  'localhost',
    accessKey: '991OQNY5DUSYGFORMKRX',
    secretKey: 'Gi2CK8DKIAZPoyRtAXDx33xdJ6IzorEzU0j30F5j',
    secure: false,
    port: 9000
  });

  var objectStream = s3Client.listBuckets(function(e, buckets) {
    if (e) {
      console.log(e)
      return
    }
    console.log('bucket: ', buckets)
  })
  res.send('respond with a resource');

});

module.exports = router;
