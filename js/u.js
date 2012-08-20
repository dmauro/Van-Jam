// Utils library
var u = (function() {
  var module = {};
  
  module.preload_images = function(images, callback) {
    var image_count = images.length;
    
    _.each(images, function(image_url) {
      var img = new Image();
      img.src = image_url;
      img.onload = function() {
        --image_count;
        if (!image_count) {
          callback();
        }
      }
    });
  };
  
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
    console.log("EVENT: " + event);
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
  
  module.query_params = function() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  }
  
  return module;
})();