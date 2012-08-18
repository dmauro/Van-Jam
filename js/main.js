$(function() {

  var INTERVALS = {};
  var SETTINGS = {
    random_options: 6,
    per_action_time: 1000,
    keymap: {
/*      "q": 0, "w": 1, "e": 2,
      "a": 3, "s": 4, "f": 5,
      "u": 0, "i": 1, "o": 2,
      "j": 3, "k": 4, "l": 5,*/
      "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "0": 9
    }
  };
  
  function random_element(arr) {
    if (!arr.length) return null;
    return arr[ Math.floor(Math.random() * arr.length) ];
  }

  function random_words(num) {
    var words = [];
    
    while (words.length < num) {
      words.push(random_element(WORDS));
      words = _.uniq(words);
    }

    return words;
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function init_scenario(scenario) {
    
    ///////////////////////////
    // Setup selectable actions
    ///////////////////////////
    
    var actions;
    
    if (scenario.actions) {
      actions = clone(scenario.actions);
    } else {
      actions =  _.map(random_words(SETTINGS.random_options), function(w, i, arr) {
        return {
          label: w,
          score: i + 1 - arr.length / 2
        };
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
      return random_element(active_actions());
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
      }
    };
    
    function bind_event(event_meta, selector) {
      selector = selector || event_meta.selector || document;
      $(selector).bind(event_meta.event, event_meta.handler);
    }
    
    function unbind_event(event_meta, selector) {
      selector = selector || event_meta.selector || document;
      $(selector).unbind(event_meta.event, event_meta.handler);
    }
    
    function countdown_start() {
      INTERVALS.countdown = setInterval(countdown_tick, SETTINGS.per_action_time);
      bind_event(COUNTDOWN_EVENTS.key_action);
    }
    
    function countdown_stop() {
      clearInterval(INTERVALS.countdown);
      unbind_event(COUNTDOWN_EVENTS.key_action);
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
      
      a.selected = true;
      action_selector(id).addClass('selected');
      
      // Halt the countdown
      countdown_stop();
      
      // Update the view
      $('#result .label').html('Action: ' + a.label);
      $('#result .score').html('Score: ' + a.score);
    }

    ////////////
    // Game init
    ////////////

    // Start the countdown
    countdown_start();

    // Setup the initial view
    $('#scenario_content').html(scenario.content);
    init_actions_view();
    update_status_view();
  }

  init_scenario( SCENARIOS.test1 );
  
});