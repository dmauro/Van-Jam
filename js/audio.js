var AUDIO = (function() {
  var audio_ready = false;
  var queued_audio_callbacks = [];
  var module = {};
  
  function when_audio_ready(callback) {
    if (audio_ready) {
      callback();
    } else {
      queued_audio_callbacks.push(callback);
    }
  }
  
  module.play = function(track) {    
    when_audio_ready(function() {
      $("#jplayer").jPlayer(
        "setFile",
        "./media/audio/" + track + ".mp3",
        "./media/audio/" + track + ".ogg"
      );
    
      $("#jplayer").jPlayer("play");      
    });
  };
  
  module.init = function() {  
    $("#jplayer").jPlayer({
      swfPath: "./js/ext",
      volume: 100,
      oggSupport: true,
      warningAlerts: true,
      ready: function() {   
        audio_ready = true;
        _.each(queued_audio_callbacks, function(c) { c(); });
        queued_audio_callbacks = [];
      }
    });
  }
  
  return module;
})();