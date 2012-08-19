$(function() {
  window.SETTINGS = {
    action_count: 6,
    per_action_time: 1500,
    scenario_outro_time: 1000,
    default_action_score: 5,
    gameflow_scenario_count: Math.min(_.keys(SCENARIOS).length, 5),
    total_scenarios: _.reduce(STAGES, function(res, stage) { return res + stage.scenarios.length }, 0),
    max_scenario_score: _.max(_.values(SCORES))
  };
  
  // dependent values
  SETTINGS.max_score = SETTINGS.total_scenarios * SETTINGS.max_scenario_score;
});



// Dependendent settings

var MANIFEST = {
  audio: [
    // music
    'love_at_first_sight_intro_loop',
    'love_at_first_sight_groove_loop',    
    'i_should_be_so_lucky',
    'red_blooded_woman',
    
    // ending music
    'on_a_night_like_this',
    'celebration',
    
    // sfx
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'sonic_boom',
    'laugh',
    'giggle',
    'yap',
    'scream',
    'high_scream',
    'yodel',
    'perfect',
    'final',
    'you',
    'stage_entry',
    'button_click',
    'offensive_effect',
    'neutral_effect'
  ]
};