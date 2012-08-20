var Stage = (function() {
  var klass = function(id, config, gameflow) {
    this.id = id;
    this.gameflow = gameflow;
    this.prompt = config.prompt;
    this.scenario_data = U.clone(config.scenarios);
    this.bg = config.bg;
    this.music = config.music;
    this.is_raul = config.is_raul;
    this.next_scenario_id = 0;
  };
    
  klass.prototype.run = function() {    
    var this_stage = this;
    
    var gameflow_events = {
      scenario_over: {
        event: 'scenario_over',
        handler: function() {          
          if (!next_scenario()) end();
        }
      }
    }
    
    function start_scenarios() {
      EVENT.bind(gameflow_events.scenario_over);
      next_scenario();
    }
    
    function end() {
      EVENT.unbind(gameflow_events.scenario_over);
      EVENT.trigger('stage_over');
    }
    
    function next_scenario() {    
      if (!this_stage.scenario_data.length) return null;     
      (new Scenario(this_stage.next_scenario_id, this_stage.scenario_data.shift(), this_stage)).run();
      this_stage.next_scenario_id += 1;
      return true;
    }

    /////////////////////
    // State choreography
    
    function show_prompt() {
      EVENT.trigger('stage_prompt_display_start', this_stage, function() {
        $('#playfield').one('click', clear_prompt);
      });
    }
    
    function clear_prompt() {
      EVENT.trigger('stage_prompt_display_end', this_stage, start_scenarios);
    }
    
    // Kick-off
    EVENT.trigger('stage_enter', this);    
    show_prompt();
  };
  
  return klass;
})();