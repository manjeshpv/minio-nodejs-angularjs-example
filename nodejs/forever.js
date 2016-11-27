var forever = require('forever');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var child = new (forever.Monitor)('./app.js', {
  max: 3,
  silent: false,
  options: []
});

//child.on('exit', this.callback);
child.start();

forever.startServer(child);
