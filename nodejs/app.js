
var http = require('http');
var express = require('express');
var minioCtrl = require('./minio.controller')

var config = require('../config');

var app = express();
var server = http.createServer(app);

require('./express')(app)

var ssl = config.minio.secure ? 's' : '';
var minioURL = 'http'+ ssl +'://' + config.minio.endPoint + ':' + config.minio.port;
// - Routes
app.get('/api/angular-config.js', function(req, res){
  return res.end('var minioURL = "'+ minioURL + '"')
});
app.get('/api/listBuckets', minioCtrl.listBuckets);
app.post('/api/makeBucket', minioCtrl.makeBucket)
app.post('/api/bucketExists', minioCtrl.bucketExists)
app.post('/api/removeBucket', minioCtrl.removeBucket)
app.get('/api/listObjects', minioCtrl.listObjects);
app.get('/api/presignedGetObject', minioCtrl.presignedGetObject)
app.get('/api/presignedPutObject', minioCtrl.presignedPutObject)
app.get('/api/presignedPostPolicy', minioCtrl.presignedPostPolicy)

require('./error-handler')(app)


server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

module.exports = app;
