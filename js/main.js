$(function() { 
  function start_game() {
    $('#loading').html('');
    
    var gameflow = new Gameflow();    
    
    if (U.query_params().skip_intro) {   
      (new Gameflow()).run();
    } else {
      INTRO.run(function() {
        (new Gameflow()).run();  
      });
    }    
  }
  
  function load_backgrounds(callback) {
    images = _.map(MANIFEST.bg, function(bg) { return ASSET.url('./img/bg/' + bg + '.png'); });
    U.preload_images(images, callback);    
  }
  
  function init_audio(callback) {
    AUDIO.set_channel_volume('score_response', 70);
    AUDIO.set_channel_volume('music', 60);  
  
    sound_config = _.reduce(MANIFEST.audio, function(res, sound_id) {
      res.push({ id: sound_id, url: ASSET.url('./audio/' + sound_id + '.mp3') });
      return res;
    }, []);
    
    AUDIO.init(sound_config, callback);
  }  
  
  // Bootstrap...sound manager needs this to happen first...
  init_audio(function() {
    load_backgrounds(start_game);
  })
});
