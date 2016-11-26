/**
 * Created by Manjesh on 26-11-2016.
 */
var express = require('express');
var minioCtrl = require('./minio.controller')

var app = express();

require('./express')(app)

// - Routes
app.get('/api/listBuckets', minioCtrl.listBuckets);
app.post('/api/makeBucket', minioCtrl.makeBucket)
app.post('/api/bucketExists', minioCtrl.bucketExists)
app.post('/api/removeBucket', minioCtrl.removeBucket)
app.get('/api/listObjects', minioCtrl.listObjects);
app.get('/api/presignedGetObject', minioCtrl.presignedGetObject)
app.get('/api/presignedPutObject', minioCtrl.presignedPutObject)
app.get('/api/presignedPostPolicy', minioCtrl.presignedPostPolicy)

require('./error-handler')(app)

module.exports = app;
