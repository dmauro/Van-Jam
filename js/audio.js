var AUDIO = (function() {
  var audio_ready = {};
  var channel_queues = {};
  var module = {};
  
  function channel_queue(channel) {
    channel_queues[channel] = channel_queues[channel] || [];
    return channel_queues[channel];
  }
  
  function reset_channel_queue(channel) {
    channel_queues[channel] = [];
  }
  
  function when_audio_ready(channel, callback) {
    if (audio_ready[channel]) {
      callback();
    } else {
      channel_queue(channel).push(callback);
    }
  }
  
  function player(channel) {
    return $('.jplayer[data-channel="' + channel + '"]')
  }
  
  module.play = function(channel, track) {    
    when_audio_ready(channel, function() {
      player(channel).jPlayer(
        'setFile',
        './media/audio/' + track + '.mp3',
        './media/audio/' + track + '.ogg'
      );    
      player(channel).jPlayer('play');      
    });
  };
  
  module.stop = function(channel, track) {
    when_audio_ready(channel, function() {
      player(channel).jPlayer('stop');
    });
  }
  
  module.init = function() {  
    $('.jplayer').each(function() {
      var _this = this;
      $(this).jPlayer({
        swfPath: './js/ext',
        volume: 100,
        oggSupport: true,
        warningAlerts: true,
        ready: function() {
          var channel = $(_this).attr('data-channel');      
          audio_ready[channel] = true;
          _.each(channel_queue(channel), function(c) { c(); });
          reset_channel_queue(channel);
        }
      });
    });
  };
  
  return module;
})();