var express = require('express');
var router = express.Router();

var Minio = require('minio')
var s3Client = new Minio({
  endPoint:  'localhost',
  accessKey: '991OQNY5DUSYGFORMKRX',
  secretKey: 'Gi2CK8DKIAZPoyRtAXDx33xdJ6IzorEzU0j30F5j',
  secure: false,
  port: 9000
});
function handleError(res,status,err){
  status = status || 500;
  res.status(status).json(err)
}

/* GET users listing. */
router.get('/listBuckets', function(req, res, next) {
  var objectStream = s3Client.listBuckets(function(err, buckets) {
    if (err) handleError(res,500,err)
    res.send(buckets);
  })
});

router.get('/makeBucket', function(req, res, next) {
  return handleError(res,404,{message: 'please try POST & send `bucketName` in request body'})
})

router.post('/makeBucket', function(req, res, next) {
  if(!req.body.bucketName) handleError(res,400,{message: 'please send `bucketName` in request body'})
  var objectStream = s3Client.makeBucket(req.body.bucketName,'us-east-1',function(err, result) {
    console.log(err,result)
    if (err) {
      if(err.code === "BucketAlreadyExists") return handleError(res,409,err)
      return handleError(res,500,err)
    }
    return res.status(201).send({message: "Bucket created successfully"});
  })
});

router.get('/bucketExists', function(req, res, next) {
  return handleError(res,404,{message: 'please try POST & send `bucketName` in request body'})
})

router.post('/bucketExists', function(req, res, next) {
  if(!req.body.bucketName) handleError(res,400,{message: 'please send `bucketName` in request body'})
  var objectStream = s3Client.bucketExists(req.body.bucketName,function(err, result) {
    // Todo: huge data coming in result
    console.log(err,result)
    if (err) {
      if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
      return handleError(res,500,err)
    }
    return res.json({message: "bucket exist"})
  })
})


router.get('/removeBucket', function(req, res, next) {
  return handleError(res,404,{message: 'please try POST & send `bucketName` in request body'})
})

router.post('/removeBucket', function(req, res, next) {
  if(!req.body.bucketName) handleError(res,400,{message: 'please send `bucketName` in request body'})
  var objectStream = s3Client.removeBucket(req.body.bucketName,function(err, result) {
    // Todo: undefined coming as result
    console.log(err,result)
    if (err) {
      if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
      return handleError(res,500,err)
    }
    return res.json({message: "bucket removed successfully"})
  })
})

router.get('/listObjects', function(req, res, next) {
  return handleError(res,404,{message: 'please try POST & send `bucketName` in request body'})
})


router.post('/listObjects', function(req, res, next) {
  if(!req.body.bucketName) handleError(res,400,{message: 'please send `bucketName` in request body'})
  var objectsStream = s3Client.listObjects(req.body.bucketName,'',true)
  // Todo: showing only last file in bucket
  //objectsStream.on('data', function(result) {
  objectsStream.on('data', function(result) {
    console.log(result)
     res.json({message: "bucket removed successfully",data:result})
  })
  //objectsStream.on('end', function(result) {
  //  console.log(result)
  //  //return res.json({message: "bucket removed successfully",data:result})
  //})

  objectsStream.on('error', function(err) {
    if (err) {
      if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
      return handleError(res,500,err)
    }
  })

});

// Todo
//listIncompleteUploads(bucket, prefix, recursive) : Stream
//
//Object
//
//fGetObject(bucket, object, filePath)
//
//getObject(bucket, object) Stream
//
//getPartialObject(bucket, object, offset, length) Stream
//
//fPutObject(bucket, object, filePath, contentType, cb)
//
//putObject(bucket, object, Stream, contentType, cb)
//
//statObject(bucket, object, cb)
//
//removeObject(bucket, object, cb)
//
//removeIncompleteUpload(bucket, object, cb)
//
//Presigned
//
//presignedGetObject(bucket, object, expires, cb)
//
//presignedPutObject(bucket, object, expires, cb
//
//presignedPostPolicy(postPolicy, cb)


//router.get('/presignedPostPolicy', function(req, res, next) {
//  return handleError(res,404,{message: 'please try POST & send `bucketName` in request body'})
//})

router.get('/presignedPostPolicy', function(req, res, next) {
  // Construct a new postPolicy.
  var policy = s3Client.newPostPolicy()
// Set the object name my-objectname.
  policy.setKey("100.pdf")
// Set the bucket to my-bucketname.
  policy.setBucket("signups")

  var expires = new Date
  expires.setSeconds(24 * 60 * 60 * 10) //10 days
  policy.setExpires(expires)

  policy.setContentLengthRange(1024, 1024*1024) // Min upload length is 1KB Max upload size is 1MB

  s3Client.presignedPostPolicy(policy, function(e, url, headers) {
    console.log("e",e)
    if (e) return handleError(res,500,err)
    return res.json({message:'send file as `file` with Content-Type: multipart/form-data',url:url,headers:headers,})
  })




  //if(!req.body.bucketName) handleError(res,400,{message: 'please send `bucketName` in request body'})
  //var objectStream = s3Client.removeBucket(req.body.bucketName,function(err, result) {
  //  // Todo: undefined coming as result
  //  console.log(err,result)
  //  if (err) {
  //    if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
  //    return handleError(res,500,err)
  //  }
  //  return res.json({message: "bucket removed successfully"})
  //})
})

module.exports = router;
