$(function() {  
  sound_config = _.reduce(MANIFEST.audio, function(res, sound_id) {
    res.push({ id: sound_id, url: './media/audio/' + sound_id + '.mp3' });
    return res;
  }, []);
  
  AUDIO.init(sound_config, function() {
    (new Gameflow()).run();
  });
});
