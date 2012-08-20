$(function() {
  window.SETTINGS = {
    action_count: 6,
    per_action_time: 2700,
    scenario_outro_time: 1000,
    default_action_score: 5,
    gameflow_scenario_count: Math.min(_.keys(SCENARIOS).length, 5),
    total_scenarios: _.reduce(STAGES, function(res, stage) { return res + stage.scenarios.length }, 0),
    max_scenario_score: _.max(_.values(SCORES)),
    min_scenario_score: _.min(_.values(SCORES))
  };
  
  // dependent values
  SETTINGS.max_score = SETTINGS.total_scenarios * SETTINGS.max_scenario_score;
  SETTINGS.good_score = SETTINGS.max_score * 0.5;
});



// Dependendent settings

var MANIFEST = {
  bg: [
    'scene_1',
    'scene_2',
    'scene_3'
  ],
  audio: [
    // music
    'love_at_first_sight_groove',    
    'i_should_be_so_lucky',
    'red_blooded_woman',
    
    // ending music
    'on_a_night_like_this',
    'celebration',
    
    // other music
    'love_at_first_sight_intro',
    'stage_entry',    
    
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
    
    'round',
    'button_click',
    
    'giggle',
    'perfect',
    'offensive_effect',
    'neutral_effect'
  ]
};