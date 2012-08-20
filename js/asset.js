var ASSET = (function() {
  var module = {}
  var global_prefix = '.';
  
  module.set_prefix = function(prefix) {
    // Remove trailing slash
    global_prefix = prefix.replace(/^\//, '');
  };  
  
  module.url = function(original) {
    // Don't do anything if we have an absolute URL
    if (original.match(/^https?:\/\//)) return original;
    
    // Remove any relative prefixes (/, ./)
    return global_prefix + '/' + original.replace(/^\.?\//, '');
  };
  
  module.write_js_include = function(relative_url) {
    document.write("<script type='text/javascript' src='" + module.url(relative_url) +  "'></scr" + "ipt>");
  }
  
  module.write_css_include = function(relative_url) {
    document.write("<link rel='stylesheet' type ='text/css' href='" + module.url(relative_url) +"' />");    
  }
  
  return module;
})();