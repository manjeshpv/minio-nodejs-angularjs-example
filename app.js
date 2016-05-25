var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var Minio = require('minio')

var s3Client = new Minio({
  endPoint:  'localhost',
  accessKey: '991OQNY5DUSYGFORMKRX',
  secretKey: 'Gi2CK8DKIAZPoyRtAXDx33xdJ6IzorEzU0j30F5j',
  secure: false
});

s3Client.listBuckets(function(e, buckets) {
  if (e) {
    console.log("e",e)
    return
  }
  console.log('buckets :', buckets)
})
//s3client.listBuckets(function(e, bucketStream) {
  //if (e) {
  //  console.log("s",e)
  //  return
  //}
  //bucketStream.on('data', function(obj) {
  //  console.log(obj)
  //})
  //bucketStream.on('end', function() {
  //  console.log("End")
  //})
  //bucketStream.on('error', function(e) {
  //  console.log("Error", e)
  //})
//})
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
