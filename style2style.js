/**
 * style2style
 * Inlines styles from style/link tags to style attributes.
 *
 * Uses values from computed values instead of style properties, to take advantage
 * of browsers css specificity/cascade implementation.
 * Document needs to be in a window for styles to be calculated properly.
 *
 * @example
 * styliner(document)
 *
 * By default, style/link tags are inlined, then removed from the document.
 * These options can be opted out of with a `data-styliner` attribute.
 * @example
 * <style type="text/css" data-styliner='{"preserve": true, "ignore": true}'>...</style>
 *
 * TODO:
 * - ?? anyting special for media rules MEDIA_RULE = 4 ??
 * - ?? pseudo selectors (2nd arg to getComputedStyle)??
 * - ?? should tags be moved from head to body??
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

  // utility to assign defaults to options
  function extend(target, source){
    target = target || {};
    for (var prop in source) {
      if(!target.hasOwnProperty(prop)) target[prop] = source[prop];
    }
    return target;
  }

  // parses the styliner options attribute
  // default is to inline the styles and remove the source element.
  function parseOptions(el){
    var raw = el.getAttribute('data-styliner');
    var opts = raw ? JSON.parse(raw) : {};
    return extend(opts, { ignore: false, preserve: false });
  }

  // remove element from the dom
  function removeElement(el){
    return el.parentNode.removeChild(el);
  }

  // inlines a rule onto an element's style attribute;
  // setting the element's inline style attribute with calulated properties.
  function inlineRule(el, rule){
    //console.log('setting', el, rule.style)
    //console.log('cssText', rule.cssText);
    //console.log('style', rule.style);
    var computed = window.getComputedStyle(el);
    for(var i = 0; i < rule.style.length; i++){
      var prop = rule.style.item(i);
      var computedVal = computed.getPropertyValue(prop);
      // if element's style attribute doesn't have this property,
      // then set it to the computed value
      //console.log('is prop null', el.style.getPropertyValue(prop))
      if(!el.style.getPropertyValue(prop)){
        el.style.setProperty(prop, computedVal);
      }
    }
  }

  // Loops through a stylesheets rules,
  // selects the rule's targeted elements,
  // and inlines the rule.
  function inlineStyle(elStyle){
    //console.log('elStyle', elStyle)
    var doc = elStyle.ownerDocument;
    var rules = [].slice.call(elStyle.sheet.cssRules);
    rules
      // only STYLE_RULEs
      // see: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
      .filter(function(r){ return r.type == 1;})
      .forEach(function(rule){
        [].slice.call(doc.querySelectorAll(rule.selectorText))
          .forEach(function(el){
            inlineRule(el, rule);
          })
    })
  }

  // takes a rendered document and inlines its stylesheets.
  return function styliner(doc){

    var tags = [].slice.call(doc.querySelectorAll('style, link[rel="stylesheet"]')),
        tags2inline = [],
        tags2remove = [];

    tags.forEach(function processTag(el){
      var opts = parseOptions(el);
      if(!opts.ignore) tags2inline.push(el);
      if(!opts.preserve) tags2remove.push(el);
    });

    // inline link/style rules
    tags2inline.forEach(inlineStyle);

    // cleanup
    tags2remove.forEach(removeElement);

    return doc;
  };

}));
