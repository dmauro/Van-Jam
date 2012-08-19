var Scenario = (function() {
  var klass = function(gameflow, config) {    
    this.gameflow = gameflow;
    this.prompt = config.prompt;

    // Setup action configurtion data.
    action_data = config.actions;    

    // Create Action objects
    this.actions = _.map(action_data, function(action_config, i) {
      return new Action(i, action_config);
    });
  };
  
  klass.prototype.run = function() {
    var this_scenario = this;
    var countdownInterval;
    
    ////////////
    // Utilities
    
    function valid_actions() {     
      return _.reduce(this_scenario.actions, function(res, a) {
        if (a.valid) res.push(a);
        return res;
      }, []);   
    }
    
    function action_labels() {      
      return _.map(this_scenario.actions, function(a) { return a.label; });
    }

    /////////////////////
    // State choreography
    
    function show_prompt() {
      $('#scenario_prompt .content').html(this_scenario.prompt);
      u.trigger_event('scenario_prompt_display_start');
      
      $('#scenario_prompt').fadeIn(500, function() {
          $('#scenario_prompt').one('click', clear_prompt);
      });
    }
    
    function clear_prompt() {
      $('#scenario_prompt').fadeOut(500, show_gameplay_intro);
    }
    
    function show_gameplay_intro() {
      $('#gameplay_intro .content').html('FLIRT!');
      u.trigger_event('gameplay_intro_display_start');
      
      $('#gameplay_intro').fadeIn(500, clear_gameplay_intro);
    }
    
    function clear_gameplay_intro() {
      $('#gameplay_intro').fadeOut(500, show_actions);
    }
    
    function show_actions() {
      $('#action_frame').fadeIn(500, start_gameplay);
    }
    
    var gameplay_events = {
      option_clicked: {
        event: 'option_clicked',
        handler: function(event, id) {
          var action = this_scenario.actions[id];
          if (!action.valid) return;
          action.select();
        }
      },
      action_selected: {
        event: 'action_selected',
        handler: function(event, action) {
          this_scenario.gameflow.modify_score(action.score);
          end_gameplay();
        }
      },
    };
    
    var termination_events = {
      actions_outro_done: {
        event: 'actions_outro_done',
        handler: function() {        
          finish();
        }
      }
    };
    
    function start_gameplay() {
      _.each(gameplay_events, function(e) { u.bind_event(e); });
      _.each(termination_events, function(e) { u.bind_event(e); });
      
      // Set countdown timer
      countdownInverval = setInterval(function() {
        var actions = valid_actions();
        if (actions.length == 1) {
          // Select the final remaining action
          actions.shift().select();
        } else {
          u.random_element(actions).invalidate();
          u.trigger_event('countdown_update', actions.length - 1);
        }        
      }, SETTINGS.per_action_time);
   
      u.trigger_event('countdown_update', valid_actions().length);      
      u.trigger_event('gameplay_start', action_labels());
    }
    
    function end_gameplay() {
      // Bind all gameplay events
      _.each(gameplay_events, function(e) { u.unbind_event(e); });
      
      // Clear countdown timer
      clearInterval(countdownInverval);
      
      u.trigger_event('gameplay_end');
    }
    
    function finish() {
      _.each(termination_events, function(e) { u.unbind_event(e); });
      
      $('#action_frame').fadeOut(500, function() {       
        // Broadcast event
        u.trigger_event('scenario_over');  
      });      
    }
    
    show_prompt();
  };
  
  return klass;
})();