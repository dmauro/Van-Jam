$(function() {

  // System init
  AUDIO.init([
    'i_should_be_so_lucky'
  ]);
  
  // Gameplay variables
  var INTERVALS = {};
  var SETTINGS = {
    action_count: 6,
    per_action_time: 1000,
    scenario_outro_time: 1000,
    vandammism_score: -5,
    gameflow_scenario_count: _.min([_.keys(SCENARIOS).length, 1]),
    max_scenario_score: 15, //TODO: make this data-driven
    max_gameflow_score_ratio: 0.5,
    keymap: {
/*      "q": 0, "w": 1, "e": 2,
      "a": 3, "s": 4, "f": 5,
      "u": 0, "i": 1, "o": 2,
      "j": 3, "k": 4, "l": 5,*/
      "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "0": 9
    }
  };
  
  function bind_game_event(event, callback) {
    $(document).bind(event, callback);
  }
  
  function unbind_game_event(event, callback) {
    $(document).unbind(event, callback);
  }
  
  function trigger_game_event() {
    $(document).trigger.apply($(document), arguments);
  }
  
  function init_scenario(scenario) {
    
    ///////////////////////////
    // Setup selectable actions
    ///////////////////////////
    
    var actions = scenario.actions ? u.clone(scenario.actions) : [];
    
    // Supplement actions with Vandammisms
    if (actions.length < SETTINGS.action_count) {
      var vandammisms = u.unique_random_elements(VANDAMMISMS, SETTINGS.action_count - actions.length);
      
      _.each(vandammisms, function(v) {
        actions.push({
          label: v,
          score: SETTINGS.vandammism_score
        });
      });
    }
 
    // Mark all actions as active
    _.each(actions, function(a, i) {
      a.index = i;
      a.active = true;
    });
    
    function active_actions() {
      return _.reduce(actions, function(res, a) {
        if (a.active) res.push(a);
        return res;
      }, []);
    }
    
    function random_active_action() {
      return u.random_element(active_actions());
    }
    
    function action_selector(index) {
      return $('#actions li[data-id="' + index + '"]');
    }
    
    function init_actions_view() {
      $('#actions_list').html(
        _.map(actions, function(a) {
          return "<li data-id='" + a.index + "'>" + a.label + "</li>";
        }).join('\n') 
      );
    }

    function update_status_view() {
      $('#status .countdown').html(active_actions().length);
    }
    
    ///////////////////////
    // Countdown simulation
    ///////////////////////
    
    var COUNTDOWN_EVENTS = {
      key_action: {
        event: 'keydown',
        handler: function(e) {
          // Get string equivalent of pressed keycode
          var key_string = CODES_TO_KEYS[e.which];
          var action_id = SETTINGS.keymap[key_string];
          on_action_selected(action_id);
        }
      },
      click_action: {
        event: 'click',
        handler: function(e) {         
          var action_id = $(e.target).attr('data-id');
          on_action_selected(action_id);
        },
        selector: "#actions_list li"
      }
    };
       
    function countdown_start() {
      INTERVALS.countdown = setInterval(countdown_tick, SETTINGS.per_action_time);
      u.bind_event(COUNTDOWN_EVENTS.click_action);
    }
    
    function countdown_stop() {
      clearInterval(INTERVALS.countdown);
      u.unbind_event(COUNTDOWN_EVENTS.click_action);
      
      setTimeout(function() {
        trigger_game_event('scenario_done', [scenario]);
      }, SETTINGS.scenario_outro_time);
    }
    
    function countdown_tick() {
      // Eliminate a random action
      var a = random_active_action();
    
      if (a) {
        a.active = false;
        action_selector(a.index).addClass('inactive');
      } else {
        // Countdown is over!
        countdown_stop();
      }
      
      // Update view
      update_status_view();      
    }
    
    function on_action_selected(id) {
      var a = actions[id];
      
      // Early out if the action is invalid or inactive
      if (!a || !a.active) return;
      
      scenario.selected_action = a;
      action_selector(id).addClass('selected');
      
      // Halt the countdown
      countdown_stop();
      
      // Update the view
      $('#result .label').html('Action: ' + a.label);
      $('#result .score').html('Score: ' + a.score);
    }

    /////////////////////
    // Scenario bootstrap
    /////////////////////

    // Setup the initial view
    $('#scenario_content').html(scenario.content);
    var bg = scenario.bg ? './media/bg/' + scenario.bg : '';
    $('#playfield').css({'background-image': 'url(' + bg + ')'});
    
    // Play audio
    if (scenario.music) {
      AUDIO.play('music', scenario.music);
    } else {
      AUDIO.stop('music');
    }

    init_actions_view();
    update_status_view();

    // Start the countdown
    countdown_start();
  }

  ///////////
  // GAMEFLOW
  ///////////

  function gameflow_start() {
    var gameflow_scenarios = u.unique_random_elements(_.values(SCENARIOS), SETTINGS.gameflow_scenario_count);
    var current_scenario;
    
    var max_gameflow_score = SETTINGS.max_scenario_score * gameflow_scenarios.length * SETTINGS.max_gameflow_score_ratio;
    var current_score = 0;
    
    function next_scenario() {    
      current_scenario = gameflow_scenarios.shift();      
      init_scenario(current_scenario);
    }
    
    function modify_score(delta) {      
      current_score = _.max([0, current_score + delta]);
      var percentage = Math.floor(100 * current_score/max_gameflow_score);   
      $('#current_score').css("width", percentage.toString() + "%");
    }
    
    bind_game_event('scenario_done', function(event, scenario) {
      if (gameflow_scenarios.length) {
        next_scenario();
      } else {
        trigger_game_event('gameflow_over');
      }
      
      modify_score(scenario.selected_action.score);
    })
    
    next_scenario();
  }

  ////////////////
  // App bootstrap
  ////////////////
  
  
  gameflow_start();
});
