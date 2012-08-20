$(function() {
  // Raw position modification
  /*
  var centered = ['#ending_good', '#ending_bad', '#playfield', '#stage_prompt', '#scenario_prompt', '#gameplay_intro'];
  _.each(centered, function(c) { u.center_node(c); });
  */

  // Audio channels
  AUDIO.set_channel_volume('sfx', 100);
  AUDIO.set_channel_volume('music', 70);  

  sound_config = _.reduce(MANIFEST.audio, function(res, sound_id) {
    res.push({ id: sound_id, url: './media/audio/' + sound_id + '.mp3' });
    return res;
  }, []);
  
  AUDIO.init(sound_config, function() { 
    var gameflow = new Gameflow();

    if (u.query_params().skip_intro) {   
      (new Gameflow()).run();
    } else {
      INTRO.run(function() {
        (new Gameflow()).run();  
      });
    }
  });
});
