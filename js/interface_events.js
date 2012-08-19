$(function() {
  // GUI elements
  VIEW = {
    timer: new gui.Timer(),
    score_meter: new gui.HeartMeter(),
    actions: new gui.ChoiceList(SETTINGS.action_count)    
  };
   
  // Events
  events = {
    scenario_prompt_display_start: function() {
      u.center_node('#scenario_prompt .content');
    },
    
    gameplay_intro_display_start: function() {      
      u.center_node('#gameplay_intro .content');
    },
    
    countdown_update: function(event, value) {
      VIEW.timer.set(value);
      
      var sfx_map = [false, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
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
    
    score_modified: function(event, delta, max) {
      VIEW.score_meter.modify(delta, max);
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