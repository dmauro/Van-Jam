// Utils library
var u = (function() {
  var module = {};
  
  // Returns integer in [0, max)
  module.random_int = function(max) {
    var v = Math.floor(Math.random() * max);
    return v == max ? 0 : v;
  };

  module.obj_fetch = function(obj, n) {
    var i = 0;
    for (var k in obj) {
      if (i == n) return obj[k];
      ++i;
    }
    return null;
  };  
 
  module.random_element = function(arr) { 
    if (!arr.length) return null;    
    return arr[ module.random_int(arr.length) ];
  };
  
  module.unique_random_elements = function(arr, num) {
    arr = _.uniq(arr);
    if (arr.length <= num) return arr;  
    
    var res = [];
    while (res.length < num) { 
      res.push(module.random_element(arr));
      res = _.uniq(res);
    }

    return res;
  };

  module.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Event defintions: { event: "event_label", handler: function }
  module.bind_event = function(event_meta) {
    $(document).bind(event_meta.event, event_meta.handler);
  };
  
  module.unbind_event = function(event_meta) {
    $(document).unbind(event_meta.event, event_meta.handler);
  };
  
  module.trigger_event = function() {
    var params = _.map(arguments, function(a) { return a; });
    event = params.shift();
    $(document).trigger(event, params);
  };
  
  module.vcenter_node = function(node, within) {
    within = within || $(node).parent();
    
    // HACK: widths/heights aren't updated quite fast enough, so we
    // need a slight delay.
    setTimeout(function() {
      $(node).css({
        position: 'absolute',
        top: ($(within).height() - $(node).height()) / 2
      });
    }, 0);
  };
  
  module.hcenter_node = function(node, within) {
    within = within || $(node).parent();

    // HACK: widths/heights aren't updated quite fast enough, so we
    // need a slight delay.
    setTimeout(function() {
      $(node).css({
        position: 'absolute',
        left: ($(within).width() - $(node).width()) / 2
      });
    }, 0);
  };
  
  module.center_node = function(node, within) {
    module.vcenter_node(node, within);
    module.hcenter_node(node, within);
  };
  
  return module;
})();