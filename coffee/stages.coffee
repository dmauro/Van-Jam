window.STAGES = [
    bg: "scene_1.png"
    prompt: "Script rehearsal time! Impress Kylie with your acting ability..."
    scenarios: [
      window.SCENARIOS['how_are_you'],
      window.SCENARIOS['stealth_compromised'],
      window.SCENARIOS['leaving'],
    ]
    music: 'love_at_first_sight_groove'
  ,
    bg: "scene_2.png"
    prompt: "The film crew is getting the next scene set up. Here's your chance to show Kylie the real you."
    scenarios: [
      window.SCENARIOS['rough_year'],
      window.SCENARIOS['conversational'],
      window.SCENARIOS['leaving_thailand'],
    ]
    music: 'i_should_be_so_lucky'
  ,
    bg: "scene_3.png"
    prompt: 'Oh no! Raul Julia has invited Kylie to his trailer for a "glass of wine."'
    is_raul: true
    scenarios: [
      window.SCENARIOS['villainy'],
      window.SCENARIOS['fellow_warrior'],
      window.SCENARIOS['dying_raul'],
    ]
    music: 'red_blooded_woman'
  ,
];