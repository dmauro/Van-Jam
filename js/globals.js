var SETTINGS = {
  action_count: 6,
  per_action_time: 1500,
  scenario_outro_time: 1000,
  default_action_score: 5,
  gameflow_scenario_count: Math.min(_.keys(SCENARIOS).length, 5),
  max_scenario_score: 15, //TODO: make this data-driven
  max_gameflow_score_ratio: 0.5
};

var MANIFEST = {
  audio: [
    // music
    'i_should_be_so_lucky',
    
    'love_at_first_sight_intro_loop',
    'love_at_first_sight_buildup_to_groove',
    
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
    'you'
  ]
};