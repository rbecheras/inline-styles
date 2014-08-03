/**
 * style2style
 * Inilines styles from style tags to style attributes
 *
 *
 */
// UMD's amdWeb pattern
(function (root, factory) {
  if (typeof define === 'function' && define.amd){
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.style2style = factory();
  }
}(this, function(){

  // get elements for selector
  // convert elements 2 array
  // set attr
  //
  //
  // select4Rule: function(rule) {
  //   return rule.querySelectorAll(rule.selectorText);
  // }
  //
  function inlineRule(el, rule){
    //console.log('setting', el, rule.style)
    //el.style.cssText = rule.style;// HERE
    //el.style.cssText = 'font-weight: bold'
    console.log('cssText', rule.cssText);
    console.log('style', rule.style);
    for(var i = 0; i < rule.style.length; i++){
      var prop = rule.style.item(i);
      el.style.setProperty(prop, rule.style.getPropertyValue(prop))
      //console.log(rule.style.getPropertyValue(rule.style.item(i)));
      //todo check if property has value

    }


    //el.style = rule.style;
  }

  function inline(elStyle){
    //console.log('elStyle', elStyle)
    var doc = elStyle.ownerDocument;
    var rules = [].slice.call(elStyle.sheet.cssRules);

    rules.forEach(function(rule){
      //if(rule.selectorText === key) found = rule;
      var els = [].slice.call(doc.querySelectorAll(rule.selectorText));
      els.forEach(function(el){
        inlineRule(el, rule);
      })
    })
  }

  /*
  // finds a CSSStyleRule for the provided selector text
  getRule: function(key){
    var rules = [].slice.call(this.target.sheet.cssRules),
        found;
    rules.forEach(function(rule){
      if(rule.selectorText === key) found = rule;
    })
    return found;
  },
  */
  return function(doc, options){
    var dest = doc.cloneNode(true);
    // loop through style tags
    var tags = [].slice.call(dest.querySelectorAll('style'));
    tags.forEach(inline);

    return dest;
  };

}));
