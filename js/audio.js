var AUDIO = (function() {
  var channel_tracks = {};
  var channel_queues = {};
  var ready = false;
  var tracks = {};
  var module = {};
  
  function channel_q(c) {
    channel_queues[c] = channel_queues[c] || [];
    return channel_queues[c];
  }
  
  function reset_channel_q(c) {
    channel_queues[c] = [];
  }
  
  function when_ready(channel, callback) {
    if (ready) {
      callback();
    } else {      
      channel_q(channel).push(callback);
    }
  }
  
  function loop(sound) {
    sound.play({
      onfinish: function() {
        loop(sound);
      }
    });
  }
  
  module.play = function(channel, track, opts) {
    when_ready(channel, function() {
      opts = opts || {};
      
      module.stop(channel);      
      channel_tracks[channel] = tracks[track];
      
      if (opts.loop) {
        loop(channel_tracks[channel]);
      } else {
        channel_tracks[channel].play();
      }
    });
  };
  
  module.stop = function(channel) {
    if (channel_tracks[channel]) {
      channel_tracks[channel].stop();
      channel_tracks[channel] = null;
    }    
  }
  
  module.init = function(sounds) {  
    soundManager.setup({
      url: './js/ext',
      flashVersion: 9,
      onready: function() {
        _.each(sounds, function(track) {
          tracks[track] = soundManager.createSound({
            id: track,
            url: './media/audio/' + track + '.mp3',
            autoLoad: true,
            autoPlay: false
          });        
        });
        
        ready = true;
        
        _.each(channel_queues, function(q, c) {       
          _.each(q, function(callback) { callback(); });
          reset_channel_q(c);
        });
      }
    });
  };
  
  return module;
})();