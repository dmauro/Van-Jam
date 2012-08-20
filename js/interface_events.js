$(function() {
  // GUI elements
  VIEW = {
    timer: new gui.Timer(),
    score_meter: new gui.HeartMeter(),
    actions: new gui.ChoiceList(SETTINGS.action_count),
    scene: new gui.Scenario()
  };
   
  // Events
  var events = {
    
    game_intro_done: function() {
      AUDIO.stop('music');
    },
    
    stage_enter: function(event, stage) {
      var url = ASSET.url('./img/bg/' + stage.bg);
      $('#playfield').css({'background-image': 'url(' + url + ')'});      
    },
    
    stage_over: function() {
      AUDIO.stop('music');
    },
    
    stage_prompt_display_start: function(event, stage, anim_done_callback) {
      AUDIO.play('music', 'stage_entry');
      VIEW.scene.set_scene(stage.id + 1, stage.prompt, anim_done_callback);      
    },
    
    stage_prompt_display_end: function(event, stage, anim_done_callback) {
      AUDIO.play('ui', 'button_click');
      AUDIO.play('music', stage.music, {loop: true});      
      VIEW.scene.hide_scene(anim_done_callback);
    },
    
    scenario_prompt_display_start: function(event, scenario, anim_done_callback) {
      VIEW.scene.show_prompt(scenario.prompt, anim_done_callback, !scenario.stage.is_raul);
    },

    scenario_prompt_display_end: function(event, anim_done_callback) {
      AUDIO.play('ui', 'button_click');
      VIEW.scene.hide_prompt(); // doesn't take callback
      anim_done_callback();
    },
    
    gameplay_intro_display_start: function(event, scenario, anim_done_callback) {
      var sfx_map = ['one', 'two', 'three'];
      if (sfx_map[scenario.id]) {
        AUDIO.play_list('sfx', ['round', sfx_map[scenario.id]]);
      }
      
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
      $('#hud').fadeIn(100);      
      
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

      if (delta == SETTINGS.max_scenario_score) {
          AUDIO.play('score_response', 'perfect');
      } else if (delta == SETTINGS.min_scenario_score) {
          AUDIO.play('score_response', 'offensive_effect');
      } else if (delta > 0) {
          AUDIO.play('score_response', 'giggle');
      } else {
          AUDIO.play('score_response', 'neutral_effect');
      }
    },
    
    action_invalidated: function(event, action) {
      VIEW.actions.remove_option(action.id);
    },
    
    action_selected: function(event, action) {
      VIEW.actions.stop(action.id, function() {
        $('#hud').fadeOut(100);
        EVENT.trigger('actions_outro_done');
      });
    },
    
    ending_good: function() {
      $('#ending_good').fadeIn(500);
      AUDIO.play('music', 'celebration');      
    },

    ending_bad: function() {
      $('#ending_bad').fadeIn(500);
      AUDIO.play('music', 'on_a_night_like_this');      
    }
    
  }; // var events
  
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
    EVENT.bind(event);
  });
  
  // Broadcast click events for actions
  VIEW.actions.on_option_click(function(id) {
    EVENT.trigger('option_clicked', id);
  });
});