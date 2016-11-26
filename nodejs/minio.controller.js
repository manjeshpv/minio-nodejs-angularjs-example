
var minio = require('./minio.connection');

var config = require('../config')

function handleError(res, status, err){
  console.error('minio.controller', err)
  status = status || 500;
  //err = { message: err.message, stack: err.stack }
  return res.status(status).json(err)
}

exports.listBuckets = function(req, res, next) {
  return minio.listBuckets(function(err, buckets) {
    if (err) handleError(res, 500, err)
    return res.json(buckets);
  })
};

exports.makeBucket =  function(req, res, next) {
  if(!req.body.name) return res.status(400).end();
  minio.makeBucket(req.body.name, config.minio.region, function(err, result) {
    if (err) {
      if(err.code === "BucketAlreadyExists") return res.status(409).end();
      return handleError(res, 500, err)
    }
    return res.status(201).end();
  })
}

exports.bucketExists = function(req, res, next) {
  if(!req.body.bucketName) return res.status(400).end();
  var objectStream = minio.bucketExists(req.body.bucketName,function(err, result) {
    // Todo: huge data coming in result
    if (err) {
      if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
      return handleError(res,500,err)
    }
    return res.json({message: "bucket exist"})
  })
}

exports.removeBucket = function(req, res, next) {
  if(!req.body.bucketName) return res.status(400).end();
  var objectStream = minio.removeBucket(req.body.bucketName,function(err, result) {
    // Todo: undefined coming as result
    if (err) {
      if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
      return handleError(res,500,err)
    }
    return res.json({message: "bucket removed successfully"})
  })
}

exports.listObjects = function(req, res, next) {
  if(!req.query.name) return res.status(400).end();
  var objectsPromise = new Promise(function(resolve, reject){
      var objectsStream = minio.listObjects(req.query.name, '', true)
      var objects = [];
      objectsStream.on('data', function(data){
        objects.push(data)
      })
      objectsStream.on('end',  function(){
        resolve(objects)
      })
      objectsStream.on('error',  reject)
  })

  return objectsPromise
    .then(function(objects){
      return res.json(objects)
    })
    .catch(function(err){
      if (err.code === 'NoSuchBucket') return res.status(400).json({message: "bucket not exist"})
      return handleError(res, 500, err)
    })
}

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

exports.presignedGetObject = function(req, res, next) {
  function callback(e, presignedUrl) {
    if (e) return handleError(res,500,e)
    return res.redirect(presignedUrl)
  }

  // Presigned get object URL for my-objectname at my-bucketname, it expires in 7 days by default.
  var expires = 24 * 60 * 60;   // Expired in one day
  if(req.query.download === 'true'){
    headers = {
      'response-content-disposition':
        `attachment; filename="${(req.query.object.split('/').pop()).replace(/[^a-zA-Z0-9-_\.]/g, '')}"` };
    return minio.presignedGetObject(req.query.bucket, req.query.object, expires, headers, callback)
  }
  return minio.presignedGetObject(req.query.bucket, req.query.object, expires, callback)
}

//
//presignedPutObject(bucket, object, expires, cb
//
//presignedPostPolicy(postPolicy, cb)


//router.get('/presignedPostPolicy', function(req, res, next) {
//  return handleError(res,404,{message: 'please try POST & send `bucketName` in request body'})
//})


exports.presignedPutObject = function(req, res, next){
  return minio.presignedPutObject(req.query.bucket, req.query.object, 24*60*60, function(err, presignedUrl) {
    if (err) return handleError(res, 500, err)
    res.json(presignedUrl)
  })
}

exports.presignedPostPolicy = function(req, res, next) {
  // Construct a new postPolicy.
  var policy = minio.newPostPolicy()

  // Set the bucket to my-bucketname.
  policy.setBucket(req.query.bucket);
  // Set the object name my-objectname.
  policy.setKey(req.query.object);

  var expires = new Date;
  expires.setSeconds(24 * 60 * 60 * 1); //1 days

  policy.setExpires(expires);

  policy.setContentLengthRange(1024, 1024*1024); // Min upload length is 1KB Max upload size is 1MB

  minio.presignedPostPolicy(policy, function(err, url, headers) {
    if (err) return handleError(res,500, err);
    return res.json({message:'send file as `file` with Content-Type: multipart/form-data',url:url,headers:headers,})
  })




  //if(!req.body.bucketName) handleError(res,400,{message: 'please send `bucketName` in request body'})
  //var objectStream = minio.removeBucket(req.body.bucketName,function(err, result) {
  //  // Todo: undefined coming as result
  //  console.log(err,result)
  //  if (err) {
  //    if (err.code === 'NoSuchBucket') return res.json({message: "bucket not exist"})
  //    return handleError(res,500,err)
  //  }
  //  return res.json({message: "bucket removed successfully"})
  //})
}


