$(function() {
  // GUI elements
  VIEW = {
    timer: new gui.Timer(),
    score_meter: new gui.HeartMeter(),
    actions: new gui.ChoiceList(SETTINGS.action_count),
    scene: new gui.Scenario()
  };
   
  // Events
  events = {
    game_intro_done: function() {
      AUDIO.stop('music');
      $('#hud').fadeIn(500);
    },
    
    stage_enter: function(event, stage) {
      $('#playfield').css({'background-image': 'url(' + './img/bg/' + stage.bg + ')'});      
    },
    
    stage_over: function() {
      AUDIO.stop('music');      
    },
    
    stage_prompt_display_start: function(event, stage, anim_done_callback) {
      VIEW.scene.set_scene(stage.id + 1, stage.prompt, anim_done_callback);      
    },
    
    stage_prompt_display_end: function(event, stage, anim_done_callback) {
      AUDIO.play('music', stage.music, {loop: true});      
      VIEW.scene.hide_scene(anim_done_callback);
    },
    
    scenario_prompt_display_start: function(event, scenario, anim_done_callback) {
      VIEW.scene.show_prompt(scenario.prompt, anim_done_callback, !scenario.stage.is_raul);
    },

    scenario_prompt_display_end: function(event, anim_done_callback) {
      VIEW.scene.hide_prompt(); // doesn't take callback
      anim_done_callback();
    },
    
    gameplay_intro_display_start: function(event, scenario, anim_done_callback) {
      VIEW.scene.start_round(scenario.id + 1, anim_done_callback);
    },
    
    countdown_update: function(event, value) {
      VIEW.timer.set(value);
      
      var sfx_map = [false, 'one', 'two', 'three', 'four', 'five'];
      if (sfx_map[value]) {
        AUDIO.play('sfx', sfx_map[value]);
      }
    },
    
    gameplay_start: function(event, option_labels) {      
      // Timer
      VIEW.timer.show();
      
      // Actions
      _.each(option_labels, function(text, i) {
        VIEW.actions.name_option(i, text);
      });
      
      VIEW.actions.go();
    },
    
    gameplay_end: function(event) {
      VIEW.timer.hide();
    },
    
    score_modified: function(event, delta) {    
      VIEW.score_meter.modify(delta, SETTINGS.max_score);
    },
    
    action_invalidated: function(event, action) {
      VIEW.actions.remove_option(action.id);
    },
    
    action_selected: function(event, action) {
      VIEW.actions.stop(action.id, function() {        
        u.trigger_event('actions_outro_done');
      });
    }
  };
  
  // Convert events into event handler objects
  events = _.reduce(events, function(res, handler, event) {
    res[event] = {
      'event': event,
      'handler': handler
    };
    return res;
  }, {});
 
  // Bind all events
  _.each(events, function(event, id) {
    u.bind_event(event);
  });
  
  // Broadcast click events for actions
  VIEW.actions.on_option_click(function(id) {
    u.trigger_event('option_clicked', id);
  });
});