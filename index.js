var restify         = require('restify');

var SearchHandler   = require('./handlers/search');
var QueueHandler    = require('./handlers/queue');
var ImageHandler    = require('./handlers/image');

var server = restify.createServer({
  name: 'glitch',
  version: '1.0.0'
});

server.use(restify.CORS());

server.get('/song/search/:searchterm', SearchHandler );
server.get('/song/:artist/:name/:mbid/getqueue/:count', QueueHandler );
server.get('/image/random/:interest', ImageHandler );

server.listen('1993');
