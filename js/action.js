var Action = (function() {
  var klass = function(id, config) {
    this.label = config.label;
    this.score = config.score;
    this.valid = true;    
    this.id = id;
  };
  
  klass.prototype.invalidate = function() {
    this.valid = false;
    $(this.elem).addClass('invalid');
    EVENT.trigger('action_invalidated', this);
  };
  
  klass.prototype.select = function() {
    $(this.elem).addClass('selected');
    EVENT.trigger('action_selected', this);
  };
  
  return klass;
})();