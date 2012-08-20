// Utils library
var U = (function() {
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