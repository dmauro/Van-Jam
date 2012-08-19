var Stage = (function() {
  var klass = function(gameflow, config) {
    this.gameflow = gameflow;
    this.prompt = config.prompt;
    this.scenario_data = u.clone(config.scenarios);
    this.bg = config.bg || 'sagat.jpg';
    this.music = config.music || 'i_should_be_so_lucky';  
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
      u.bind_event(gameflow_events.scenario_over);
      next_scenario();
    }
    
    function end() {
      u.unbind_event(gameflow_events.scenario_over);
      u.trigger_event('stage_over');
    }
    
    function next_scenario() {    
      if (!this_stage.scenario_data.length) return null;     
      (new Scenario(this_stage.gameflow, this_stage.scenario_data.shift())).run();
      return true;
    }

    /////////////////////
    // State choreography
    
    function show_prompt() {
      $('#stage_prompt .content').html(this_stage.prompt);
      u.trigger_event('stage_prompt_display_start');
      
      $('#stage_prompt').fadeIn(500, function() {
          $('#stage_prompt').one('click', clear_prompt);
      });
    }
    
    function clear_prompt() {
      $('#stage_prompt').fadeOut(500, start_scenarios);
    }
    
    // Kick-off   
    AUDIO.play('music', this.music, {loop: true});
    $('#playfield').css({'background-image': 'url(' + './img/bg/' + this.bg + ')'});
    
    show_prompt();
  };
  
  return klass;
})();