var Gameflow = (function() {
  var klass = function() {
    this.stage_data = u.clone(STAGES);
    this.score = 0;
  };
  
  klass.prototype.modify_score = function(score) {
    this.score += score;
    u.trigger_event('score_modified', score, this.max_score);
  };

  klass.prototype.run = function() { 
    var this_gameflow = this;
    
    gameflow_events = {
      stage_over: {
        event: 'stage_over',
        handler: function() {          
          if (!next_stage()) end();
        }
      }
    }
    
    function start() {     
      u.bind_event(gameflow_events.stage_over);
      next_stage();
    }
    
    function end() {
      u.unbind_event(gameflow_events.stage_over);
    }
    
    var current_stage;
    
    function next_stage() {
      if (!this_gameflow.stage_data.length) return null;
      current_stage = new Stage(this_gameflow, this_gameflow.stage_data.shift());
      current_stage.run();
      return current_stage;
    }    
    
    ///////////
    // Kick-off
    
    start();
  }
  
  return klass;
})();