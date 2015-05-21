var Flickr = require('flickr-client');

var API_KEY     = '';

var ImageHandler = function(req, res, next){
  var interest = req.params['interest'];
  var flickr   = Flickr({
    key : API_KEY
  });

  flickr('photos.search', {
    text: interest,
    content_type: 1,
    format: 'json',
    licence: 7,
    sort: 'relevance'
  }, function(err, response){
    res.send(200, response);
  });

};

module.exports = ImageHandler;
