var EVENT = (function() {
  var module = {};
  
  // Event defintions: { event: "event_label", handler: function }
  module.bind = function(event_meta) {
    $(document).bind(event_meta.event, event_meta.handler);
  };
  
  module.unbind = function(event_meta) {
    $(document).unbind(event_meta.event, event_meta.handler);
  };
  
  module.trigger = function() {
    var params = _.map(arguments, function(a) { return a; });
    event = params.shift();
    //console.log("EVENT: " + event);
    $(document).trigger(event, params);
  };
  
  return module;
})();