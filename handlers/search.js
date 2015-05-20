var LastFmNode = require('lastfm').LastFmNode;
var Youtube    = require('youtube-api');

var YOUTUBE    = {
  API_KEY      : 'AIzaSyAr4ZF8XJqh1ru1Fvw8f5e27KleSYDcRGs'
};

var LASTFM     = {
  API_KEY      : '91f3de73fcc150a08cde36ac623525c1'
}

var SearchHandler = function(req, res, next){
  var lastfm = new LastFmNode({
    api_key: LASTFM.API_KEY
  });

  var searchTerm = req.params['searchterm'];
  var request    = lastfm.request('tag.search', {
    limit        : 4,
    tag          : searchTerm,
    format       : 'json'
  });

  request.on('success', function(response){
    var results    = response.results;
    var count      = results['opensearch:totalResults'];

    if (count == 0) {
      return SearchHandler.notFound(req, res, next);
    }

    var tags       = results.tagmatches.tag;
    var random     = Math.floor(Math.random() * (tags.length));
    var tag;

    if (tags instanceof Array){
      tag        = tags[random].name;
    } else {
      tag        = tags.name;
    }

    SearchHandler.searchTrack(tag, req, res, next);
  });
};

SearchHandler.searchTrack = function(tag, req, res, next){
  var lastfm = new LastFmNode({
    api_key: LASTFM.API_KEY
  });

  var request    = lastfm.request('tag.getTopTracks', {
    limit        : 20,
    tag          : tag,
    format       : 'json'
  });

  request.on('success', function(response){
    var toptracks = response.toptracks;
    var count     = toptracks.total || toptracks['@attr'].total;

    if (count == 0) {
      return SearchHandler.notFound(req, res, next);
    }

    var tracks   = toptracks.track;
    var random   = Math.floor(Math.random() * (tracks.length));
    var track    = tracks[random];

    SearchHandler.getSongFromYoutube(track, req, res, next);
  });
};

SearchHandler.getSongFromYoutube = function(track, req, res, next){
  Youtube.search.list({
    part: 'snippet',
    videoDuration: 'medium',
    type: 'video',
    maxResults: 1,
    videoEmbeddable: true,
    key: YOUTUBE.API_KEY,
    q: track.artist.name + ' ' + track.name
  }, function(err, response){
    var result = {
      name      : track.name,
      artist    : track.artist.name,
      mbid      : track.mbid,
      videoId   : response.items[0].id.videoId
    }
    res.send(200, result);
  });

  return next();
}

SearchHandler.notFound = function(req, res, next){
  res.send(404)
};

module.exports = SearchHandler;
