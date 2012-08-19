var Action = (function() {
  var klass = function(id, config) {
    var this_action = this;
    
    this.score = config.score;
    this.valid = true;    
    this.id = id;
    
    //TEMP
    this.elem = $('<li data-id="' + this.id + '">' + config.label + '</li>').appendTo('#action_list');
    $(this.elem).click(function() { this_action.on_click() });
  };
  
  klass.prototype.on_click = function() {
    if (!this.valid) return;
    this.select();
  }
  
  klass.prototype.invalidate = function() {
    this.valid = false;
    $(this.elem).addClass('invalid');
    u.trigger_event('action_invalidated', this);
  };
  
  klass.prototype.select = function() {
    $(this.elem).addClass('selected');
    u.trigger_event('action_selected', this);
  };
  
  return klass;
})();