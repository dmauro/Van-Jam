var Scenario = (function() {
  var klass = function(id, config, stage) {
    this.id = id;
    this.stage = stage;
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
      EVENT.trigger('scenario_prompt_display_start', this_scenario, function() {
        $('#playfield').one('click', clear_prompt);
      });
    }
    
    function clear_prompt() {
      EVENT.trigger('scenario_prompt_display_end', show_gameplay_intro);
    }
    
    function show_gameplay_intro() {
      EVENT.trigger('gameplay_intro_display_start', this_scenario, start_gameplay);
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
          this_scenario.stage.gameflow.modify_score(action.score);
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
      _.each(gameplay_events, function(e) { EVENT.bind(e); });
      _.each(termination_events, function(e) { EVENT.bind(e); });
      
      // Set countdown timer
      countdownInverval = setInterval(function() {
        var actions = valid_actions();
        if (actions.length == 1) {
          // Select the final remaining action
          actions.shift().select();
        } else {
          U.random_element(actions).invalidate();
          EVENT.trigger('countdown_update', actions.length - 1);
        }        
      }, SETTINGS.per_action_time);
   
      EVENT.trigger('countdown_update', valid_actions().length);      
      EVENT.trigger('gameplay_start', action_labels());
    }
    
    function end_gameplay() {
      // Bind all gameplay events
      _.each(gameplay_events, function(e) { EVENT.unbind(e); });
      
      // Clear countdown timer
      clearInterval(countdownInverval);
      
      EVENT.trigger('gameplay_end');
    }
    
    function finish() {
      _.each(termination_events, function(e) { EVENT.unbind(e); });
      EVENT.trigger('scenario_over');  
    }
    
    show_prompt();
  };
  
  return klass;
})();