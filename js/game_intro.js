var INTRO;
$(function() {
  
  INTRO = {};
  
  var lines = [
    {
      text: 'Yes. OK.',
      time: 4000,
    },
    {
      text: 'Yes, yes, yes. It happened.',
      time: 4000,
    },
        {
      text: 'I was in Thailand, we had an affair.',
      time: 4000,
    },
    {
      text: 'Sweet kiss, beautiful lovemaking.',
      time: 4000,
    },
    {
      text: 'She\'s so beautiful and she was there in front of me every day with a beautiful smile.',
      time: 6000,
    },
    {
      text: 'Simpatico, so charming.',
      time: 4500,
    },
    {
      text: 'I knew Thailand very well, so I showed her my Thailand.',
      time: 7000,
    },
    // Stub for end of script
    {
      text: '',
      time: 1
    }
  ];
  
  var lines_remaining;
  var text_timeout;
  
  var total_time = _.reduce(lines, function(res, line) {
    return res + line.time;
  }, 0);
  
  var text_nodes = {
    next: $('#game_intro_text .a'),
    current: $('#game_intro_text .b')
  };
  
  function clear_transition_callbacks() {
    clearTimeout(text_timeout);      
  }
  
  function switch_text(text) {        
    text_nodes.current.animate({opacity: 0}, 500, function() {
      text_nodes.next.html(text);
      text_nodes.next.animate({opacity: 1}, 500);
      
      // Swap current and next nodes    
      var temp = text_nodes.next;
      text_nodes.next = text_nodes.current;
      text_nodes.current = temp;       
    });     
  }
  
  function next_line() {
    clear_transition_callbacks();
    
    if (lines_remaining.length) {
      line = lines_remaining.shift();
      current_text = line.text;
      switch_text(current_text);
      
      text_timeout = setTimeout(function() {
        text_timeout = null;
        next_line();        
      }, line.time);
    } else {
      end();
    }
  }
  
  var finish_callback;
  
  function end() {
    clear_transition_callbacks();
    
    $('#game_intro').fadeOut(500, function() {
      EVENT.trigger("game_intro_done");
      if (finish_callback) finish_callback();      
    });
  }
  
  INTRO.run = function(callback) {
    AUDIO.play('music', 'love_at_first_sight_intro', {loop: true});
    finish_callback = callback;
    
    $('#game_intro').fadeIn(500, function() {
      lines_remaining = U.clone(lines);
      next_line();
      $('#game_intro img').animate({opacity: 0.7}, total_time);   
    })
  }
});