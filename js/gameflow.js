var Gameflow = (function() {
  var klass = function() {
    this.sessions = 0;
  };
  
  klass.prototype.modify_score = function(score) {
    this.score += score;
    u.trigger_event('score_modified', [score, this.max_score]);
  };

  klass.prototype.run = function() {
    var this_gameflow = this;
    
    this.sessions += 1;
    this.scenario_data = u.clone(u.unique_random_elements(_.values(SCENARIOS), SETTINGS.gameflow_scenario_count));
    this.max_score = SETTINGS.max_scenario_score * this.scenario_data.length * SETTINGS.max_gameflow_score_ratio;    
    this.score = 0;
    
    gameflow_events = {
      scenario_over: {
        event: 'scenario_over',
        handler: function() {          
          if (!this_gameflow.next_scenario()) end();
        }
      }
    }
    
    function start() {
      u.bind_event(gameflow_events.scenario_over);
      this_gameflow.next_scenario();
    }
    
    function end() {
      u.unbind_event(gameflow_events.scenario_over);
    }
    
    ///////////
    // Kick-off
    
    start();
  }
  
  klass.prototype.next_scenario = function() {    
    if (!this.scenario_data.length) return null;
    this.current_scenario = new Scenario(this, this.scenario_data.shift());
    this.current_scenario.run();
    return this.current_scenario;
  }
  
  return klass;
})();