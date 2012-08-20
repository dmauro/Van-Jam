var GAME_TEXT_ASSETS = {
  load: function() {
    css = [
      'css/main.css',
      'css/interface.css'
    ];
    
    for (var i = 0; i < css.length; ++i) ASSET.write_css_include(css[i]);
    
    js = [
      // ext libs
      'js/ext/jquery.js',
      'js/ext/underscore.js',
      'js/ext/soundmanager2-jsmin.js',
      
      // generic libs
      'js/u.js',            
  
      // config
      'js/scenarios.js',
      'js/stages.js', 
      'js/globals.js',
      
      // engine
      'js/audio.js',    
      'js/action.js',
      'js/scenario.js',
      'js/stage.js',
      'js/gameflow.js',
      
      // game
      'js/interface.js',    
      'js/interface_events.js',
      'js/game_intro.js',
      'js/main.js',        
    ];
    
    for (var i = 0; i < js.length; ++i) ASSET.write_js_include(js[i]);
  }  
};