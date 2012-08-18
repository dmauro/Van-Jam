// Utils library
var u = (function() {
  var module = {};
  
  module.random_element = function(arr) {
    if (!arr.length) return null;
    return arr[ Math.floor(Math.random() * arr.length) ];
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
  
  module.fetch = function(obj, n) {
    var i = 0;
    for (var k in obj) {
      if (i == n) return obj[k];
      ++i;
    }
    return null;
  };
  
  // Event defintions: { event: "event_label", handler: function }
  module.bind_event = function(event_meta, selector) {
    selector = selector || event_meta.selector || document;    
    $(selector).bind(event_meta.event, event_meta.handler);
  };
  
  module.unbind_event = function(event_meta, selector) {
    selector = selector || event_meta.selector || document;
    $(selector).unbind(event_meta.event, event_meta.handler);
  };  
  
  return module;
})();