var AUDIO = (function() {
  var module = {};

  var current_tracks = {};
  var sound_library = {};
  var channel_volume = {};
  
  function loop(sound, volume) {    
    sound.play({
      'volume': volume || 100,      
      onfinish: function() {
        loop(sound);
      }
    });
  }
  
  ///////////////////
  // Public interface
    
  module.init = function(sounds, callback) {
    var sound_load_count = sounds.length;   
    
    soundManager.setup({
      url: './js/ext',
      flashVersion: 9,
      onready: function() {
        // Load each sound
        _.each(sounds, function(sound_config) {
          sound_library[sound_config.id] = soundManager.createSound({
            id: sound_config.id,
            url: sound_config.url,
            autoLoad: true,
            autoPlay: false,
            onload: function() {
              --sound_load_count;
              if (!sound_load_count) {
                callback();
              }
            }
          });        
        });
      }
    });
  };
  
  module.set_channel_volume = function(channel, v) {
    channel_volume[channel] = v;
  };

  module.play = function(channel, sound_id, opts) {
    opts = opts || {};
    
    module.stop(channel);      
    current_tracks[channel] = sound_library[sound_id];
    
    if (opts.loop) {
      loop(current_tracks[channel], channel_volume[channel]);
    } else {
      current_tracks[channel].play({ volume: channel_volume[channel] || 100 });
    }
  };
  
  module.stop = function(channel) {
    if (current_tracks[channel]) {
      current_tracks[channel].stop();
      current_tracks[channel] = null;
    }    
  }
  
  return module;
})();