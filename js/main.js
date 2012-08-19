$(function() {  
  sound_config = _.reduce(MANIFEST.audio, function(res, sound_id) {
    res.push({ id: sound_id, url: './media/audio/' + sound_id + '.mp3' });
    return res;
  }, []);
  
  AUDIO.init(sound_config, function() {
    INTRO.run();
    
    // Start the game when the intro is complete
    u.bind_event({
      event: 'game_intro_done',
      handler: function() {
        (new Gameflow()).run();  
      }
    });
  });
});
