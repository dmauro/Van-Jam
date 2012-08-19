var AUDIO = (function() {
  var module = {};

  var current_tracks = {};
  var sound_library = {};
  var channel_volume = {};
 
  var all_sounds_load_started = false;
  var ready_callback = null;
  
  function all_sounds_loaded() {
    if (!all_sounds_load_started) return false;
    
    for (var i = 0; i < sound_library.length; ++i) {
      if (!sound_library[i].loaded) return false;
    }
    
    return true;
  }
  
  var ghetto_mutex = false;
  function attempt_ready_callback() {
    if (ghetto_mutex) return;
    ghetto_mutex = true;
    
    if (ready_callback && all_sounds_loaded()) {
      ready_callback();
      ready_callback = null
    }
    
    ghetto_mutext = false;
  };  
  
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
    ready_callback = callback;
    
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
            onload: attempt_ready_callback
          });        
        });
        
        all_sounds_load_started = true;
        
        // Attempt the ready callback immediately.
        attempt_ready_callback();
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