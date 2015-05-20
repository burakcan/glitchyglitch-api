var LastFmNode           = require('lastfm').LastFmNode;
var Youtube              = require('youtube-api');

var YOUTUBE    = {
  API_KEY      : 'AIzaSyAr4ZF8XJqh1ru1Fvw8f5e27KleSYDcRGs'
};

var LASTFM     = {
  API_KEY      : '91f3de73fcc150a08cde36ac623525c1'
}

var QueueHandler = function(req, res, next){
  var lastfm = new LastFmNode({
    api_key: LASTFM.API_KEY
  });

  var artist = req.params['artist'];
  var name   = req.params['name'];
  var mbid   = req.params['mbid'];
  var count  = req.params['count'] || 10;

  var request    = lastfm.request('track.getSimilar', {
    limit        : count,
    artist       : artist,
    track        : name,
    mbid         : mbid,
    format       : 'json'
  });

  request.on('success', function(response){
    var tracks   = response.similartracks.track;
    QueueHandler.getTracksFromYoutube(tracks, req, res, next);
  });
};

QueueHandler.getTracksFromYoutube = function(tracks, req, res, next){
  var queue = [];
  tracks.forEach(function(track){
    Youtube.search.list({
      part: 'snippet',
      videoDuration: 'medium',
      type: 'video',
      maxResults: 1,
      videoEmbeddable: true,
      key: YOUTUBE.API_KEY,
      q: track.artist.name + ' ' + track.name
    }, function(err, response){
      
      queue.push({
        name      : track.name,
        artist    : track.artist.name,
        mbid      : track.mbid,
        videoId   : response.items[0].id.videoId
      });

      if (queue.length == tracks.length) res.send(200, queue);
    });
  });

  return next();
}

module.exports = QueueHandler;
