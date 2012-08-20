var Gameflow = (function() {
  var klass = function() {
    this.stage_data = U.clone(STAGES);
    this.score = 0;
    this.next_stage_id = 0;
  };
  
  klass.prototype.modify_score = function(score) {
    this.score += score;
    EVENT.trigger('score_modified', score);
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
      EVENT.bind(gameflow_events.stage_over);
      next_stage();
    }
    
    function end() {
      EVENT.unbind(gameflow_events.stage_over);
      
      if (this_gameflow.score >= SETTINGS.good_score) {
        EVENT.trigger('ending_good');
      } else {
        EVENT.trigger('ending_bad');
      }
      
      $(document).one('click', function() {
        window.location = './restart.html';
      });
    }
    
    var current_stage;
    
    function next_stage() {
      if (!this_gameflow.stage_data.length) return null;
      (new Stage(this_gameflow.next_stage_id, this_gameflow.stage_data.shift(), this_gameflow)).run();
      this_gameflow.next_stage_id += 1;
      return true;
    }    
    
    ///////////
    // Kick-off
    
    start();
  }
  
  return klass;
})();