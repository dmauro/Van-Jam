var Scenario = (function() {
  var klass = function(gameflow, config) {
    this.gameflow = gameflow;
    this.prompt = config.prompt;
    this.bg = config.bg || 'sagat.jpg';
    this.music = config.music || 'i_should_be_so_lucky';
console.log(this)
    // Setup action configurtion data.
    action_data = config.actions || [];    

    // Supplement action configuration with defaults
    var default_count = SETTINGS.action_count - action_data.length;
    
    if (default_count > 0) {
      var default_actions = u.unique_random_elements(DEFAULT_ACTIONS, default_count);
      
      _.each(default_actions, function(a) {
        action_data.push({
          label: a,
          score: SETTINGS.default_action_score
        });
      });
    }
        
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
    
    //TEMP
    function update_view() {
      $('#player_timer').html(valid_actions().length);
    }
    
    /////////////////////
    // State choreography
    
    function show_prompt() {
      $('#scenario_prompt')
        .html(this_scenario.prompt)
        .fadeIn(500, function() {
          $('#scenario_prompt').one('click', clear_prompt);
        });
    }
    
    function clear_prompt() {
      $('#scenario_prompt').fadeOut(500, show_gameplay_intro);
    }
    
    function show_gameplay_intro() {
      $('#gameplay_intro')
        .html('GAMEPLAY INTRO TEMP TEXT')
        .fadeIn(500, clear_gameplay_intro);
    }
    
    function clear_gameplay_intro() {
      $('#gameplay_intro').fadeOut(500, show_actions);
    }
    
    function show_actions() {
      $('#action_frame').fadeIn(500, start_gameplay);
    }
    
    var gameplay_events = {
      action_selected: {
        event: 'action_selected',
        handler: function(event, action) {
          this_scenario.gameflow.modify_score(action.score);
          end_gameplay();
        }
      },
    };
    
    function start_gameplay() {     
      u.bind_event(gameplay_events.action_selected);
      
      // Set countdown timer
      countdownInverval = setInterval(function() {
        var actions = valid_actions();
        if (actions.length == 1) {
          // Select the final remaining action
          actions.shift().select();
        } else {
          u.random_element(actions).invalidate();
          
          //TEMP
          update_view();          
        }
      }, SETTINGS.per_action_time);
      
      //TEMP
      update_view();
    }
    
    function end_gameplay() {
      // Clear callbacks
      u.unbind_event(gameplay_events.action_selected);
      clearInterval(countdownInverval);      
      
      $('#action_frame').fadeOut(500, function() {
        // Clear view
        $('#action_list').html('');
        
        // Broadcast event
        u.trigger_event('scenario_over');  
      });
    }
        
    // Kick-off   
    AUDIO.play('music', this.music, {loop: true});
    $('#playfield').css({'background-image': 'url(' + './media/bg/' + this.bg + ')'});    
    show_prompt();
  };
  
  return klass;
})();