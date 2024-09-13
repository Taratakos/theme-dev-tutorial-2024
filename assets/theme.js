window.slate = window.slate || {};
window.theme = window.theme || {};
/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();
      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });


      if (!variant) {
        return;
      }
      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */

    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


const productVariantUpdateBackground = () => {
  const elementWrapper = document.querySelector('.product__variant-wrapper');
  const element = document.querySelectorAll('.product__variant-wrapper select');
  
  element.forEach((item, index) => {
    item.addEventListener('change', (e) => {
      var selected_option = e.target.options[e.target.selectedIndex];
      let color_active = selected_option.dataset.color.split(' ')[1]
      const classes = ['raspberry', 'melon'];
      let old_classes = classes.filter(function(item) {
        return item !== color_active
      })
      if(elementWrapper.classList.contains(old_classes)){
        elementWrapper.classList.toggle(old_classes);
        elementWrapper.classList.toggle(color_active);
      }else{
        elementWrapper.classList.toggle('red');
      }
    })
  })
}
productVariantUpdateBackground()

/*================ Global ================*/
/**
 * Global Configurations
 * ------------------------------------------------------------------------------
 */
theme.config = {
  // Media queries & breakpoints based on src/styles/tools/variables.scss.liquid
  mediaQueries: {
    xs: 'screen and (max-width: 29.99em)',
    smallDown: 'screen and (max-width: 47.99em)',
    small: 'screen and (min-width: 30em) and (max-width: 47.99em)',
    smallUp: 'screen and (min-width: 30em)',
    mediumDown: 'screen and (max-width: 63.99em)',
    medium: 'screen and (min-width: 48em) and (max-width: 63.99em)',
    mediumUp: 'screen and (min-width: 48em)',
    largeDown: 'screen and (max-width: 79.99em)',
    large: 'screen and (min-width: 64em) and (max-width: 79.99em)',
    largeUp: 'screen and (min-width: 64em)',
    widescreen: 'screen and (min-width: 80em)'
  },
  breakpoints: {
    small: 480,
    medium: 768,
    large: 1024,
    widescreen: 1280
  }
};
if ((typeof ShopifyAPI) === 'undefined') {
  ShopifyAPI = {};
}

/*============================================================================
  API Helper Functions
==============================================================================*/
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
};

/*============================================================================
  API Functions
==============================================================================*/
ShopifyAPI.onCartUpdate = function(cart) {
  // alert('There are now ' + cart.item_count + ' items in the cart.');
  $('.is-updating').removeClass('is-updating');
  $('#cart-checkout-button').removeAttr('disabled')
};

ShopifyAPI.updateCartNote = function(note, callback) {
  var $body = $(document.body),
    params = {
      type: 'POST',
      url: '/cart/update.js',
      data: 'note=' + attributeToString(note),
      dataType: 'json',
      beforeSend: function() {
        $body.trigger('beforeUpdateCartNote.ajaxCart', note);
      },
      success: function(cart) {
        if ((typeof callback) === 'function') {
          callback(cart);
        } else {
          ShopifyAPI.onCartUpdate(cart);
        }
        $body.trigger('afterUpdateCartNote.ajaxCart', [note, cart]);
      },
      error: function(XMLHttpRequest, textStatus) {
        $body.trigger('errorUpdateCartNote.ajaxCart', [XMLHttpRequest, textStatus]);
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      },
      complete: function(jqxhr, text) {
        $body.trigger('completeUpdateCartNote.ajaxCart', [this, jqxhr, text]);
      }
    };
  jQuery.ajax(params);
};

ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
  var data = eval('(' + XMLHttpRequest.responseText + ')');

  if (!!data.message) {
    //alert('Sold Out');
  }
};

/*============================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/
ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
  var $body = $(document.body),
    params = {
      type: 'POST',
      url: '/cart/add.js',
      data: jQuery(form).serialize(),
      dataType: 'json',
      beforeSend: function(jqxhr, settings) {
        $body.trigger('beforeAddItem.ajaxCart', form);
      },
      success: function(line_item) {
        if ((typeof callback) === 'function') {
          callback(line_item, form);
        } else {
          ShopifyAPI.onItemAdded(line_item, form);
        }
        $body.trigger('afterAddItem.ajaxCart', [line_item, form]);
      },
      error: function(XMLHttpRequest, textStatus) {
        if ((typeof errorCallback) === 'function') {
          errorCallback(XMLHttpRequest, textStatus);
        } else {
          ShopifyAPI.onError(XMLHttpRequest, textStatus);
        }
        $body.trigger('errorAddItem.ajaxCart', [XMLHttpRequest, textStatus]);
      },
      complete: function(jqxhr, text) {
        jQuery.getJSON('/cart.js').then(cart => document.querySelector('.site-header__bag-count').innerText = cart.item_count);
        jQuery.getJSON('/?sections=cart-slide').then((response) => $('#shopify-section-cart-slide').html(response['cart-slide']).find('.js-slide--cart')).then(() => initCartSlide())
       
         if (!document.querySelector('html').classList.contains('js-open-cart')) {
           document.querySelector('.site-header__bag').click();
         }
        $body.trigger('completeAddItem.ajaxCart', [this, jqxhr, text]);
      }
    };
  jQuery.ajax(params);
};

$(document).submit('.product__form',function(e) {
  if(e.target.classList.contains('cart__form') || e.target.getAttribute('action') != '/cart/add') {
    return
  }
  e.preventDefault();
  ShopifyAPI.addItemFromForm(e.target, (lineItem, form) => console.log(lineItem, form))
})


// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function(callback) {
  $(document.body).trigger('beforeGetCart.ajaxCart');
  jQuery.getJSON('/cart.js', function(cart, textStatus) {
    if ((typeof callback) === 'function') {
      callback(cart);
    } else {
      ShopifyAPI.onCartUpdate(cart);
    }
    $(document.body).trigger('afterGetCart.ajaxCart', cart);
  });
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.changeItem = function(line, quantity) {
  var $body = $(document.body),
    params = {
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=' + quantity + '&line=' + line,
      dataType: 'json',
      beforeSend: function() {
      },
      success: function(cart) {
        ShopifyAPI.onCartUpdate(cart);
      },
      error: function(XMLHttpRequest, textStatus) {
        $('.is-updating').removeClass('.is-updating');
        console.log('ShopifyAPI.changeItem ajax error')
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      },
      complete: function(jqxhr, text) {
      }
    };
  jQuery.ajax(params);
};

/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {
  function Drawer(id, position, options) {
    var defaults = {
      close: '[js-drawer-close]',
      open: '[js-drawer-open-' + position + ']',
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $('#page-container')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + ' ' + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');
    
    if (this.$activeSource) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + ' ' + this.config.openClass
    );

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.unbindEvents();
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();

/**
 * Mobile Navigation Script
 * ------------------------------------------------------------------------------
 */

theme.MobileNav = (function() {
	var selectors = {
		mobileNavDrawer: '#mobile-nav-drawer'
	};
	var cache = {};

	function init() {
		cacheSelectors();
		initDrawer();
	}

	function cacheSelectors() {
		cache = {
			mobileNavDrawer: $(selectors.mobileNavDrawer)
		};
	}

	function initDrawer() {
		// Add required classes to HTML
		$('.js-drawer-open-left')
			.attr('aria-controls', 'mobile-nav-drawer')
			.attr('aria-expanded', 'false');

		theme.MobileNavDrawer = new theme.Drawers('mobile-nav-drawer', 'left');
	}

	return {
		init: init
	};
})();

theme.Accordion = (function(){
  var selectors = {
    container: '[js-accordion-group]',
    header: '[js-accordion-header]',
    content: '[js-accordion-content]'
  }
  function init() {
    $('body').on('click', selectors.header, function(evt){
      var $el = $(this);
      if($el.attr('aria-expanded') == 'true'){
        //this stops the slide up triggering the parent;
        $el.siblings().slideUp(400, function() {
          $(this).attr('aria-hidden', true);
        })
        // This is closing the children accordions when the parent accordion is closed.
        $el.siblings(selectors.content).find(selectors.header).each(function(){
          $(this).attr('aria-expanded', false);
          $(this).siblings(selectors.content).slideUp(400, function() {
            $(this).attr('aria-hidden', true);
          });
        })
        $el.attr('aria-expanded', false);
      } else {
        $el.parent().siblings().find(selectors.content, selectors.container).slideUp(400, function(){
          $(this).attr('aria-hidden', true);
        });
        $el.parent().siblings().find(selectors.header, selectors.container).attr('aria-expanded', false);
        $el.siblings(selectors.content).slideDown().attr('aria-hidden', false);
        $el.attr('aria-expanded', true);
      }
    })
  }
  return {
    init: init
  }
})();
theme.Tabs = (function(){
  var selectors = {
    group: '[js-tab-group]',
    trigger: '[js-tab-trigger]',
    content: '[js-tab-content]'
  }
  function init() {
    $(selectors.group).each(function(){
      if ($(this).data('tabType') === 'fade') {
        var $content = $(this).find(selectors.content);
        enquire.register(theme.config.mediaQueries.smallDown,{
          match: function(){
            setTallest($content);
          }
        }).register(theme.config.mediaQueries.medium,{
          match: function(){
            setTallest($content);
          }
        }).register(theme.config.mediaQueries.largeUp,{
          match: function(){
            setTallest($content);
          }
        });

        $(this).on('click', selectors.trigger, function(evt){
          var $trigger = $(this),
          $tab = $('#' + $trigger.attr('aria-controls'));

          $(this).find(selectors.content+'[aria-hidden="false"]').prepareTransition();
          $content.attr('aria-hidden', true);
          
          $trigger.filter($tab).attr('aria-selected', true);
          $tab.prepareTransition().attr('aria-hidden', false);

          $trigger.siblings().attr('aria-selected', false);
          $trigger.attr('aria-selected', true);
        });

      } else {
        $(this).on('click', selectors.trigger, function(evt){
          var $trigger = $(this);
          var selected = JSON.parse($trigger.attr('aria-selected'))

          if (selected) { return }

            var $content = $('#' + $trigger.attr('aria-controls'))
          $content.siblings(selectors.content).slideUp(400, function(){
            $(this).attr('aria-hidden', true)
          })
          $content.slideDown(400, function(){
            $(this).attr('aria-hidden', false)
          })

          $trigger.siblings(selectors.trigger).slideDown().attr('aria-selected', false)
          $trigger.attr('aria-selected', true)

        })
      }
    });
  }

  function setTallest(content) {
    var maxHeight = 0;
    var tallestTab = content[0];

    content.each(function(){
      tallestTab = $(this).height() > maxHeight ? this : tallestTab;
      maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
    });

    $(tallestTab).css('position', 'static');
    content.not($(tallestTab)).css('position', 'absolute');
  }
  return {
    init: init
  }
})();
theme.QuantitySelectors = (function(){
  var selectors = {
    qtyAdjust: '[js-qty-adjust]',
    qtyInput: '[js-qty-num]'
  }

  function init() {
    _qtySelectors();
  }

  function _qtySelectors() {
    // Setup listeners to add/subtract from the input
    $('body').on('click', selectors.qtyAdjust, function(e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var $qtySelector = $el.siblings(selectors.qtyInput);
      var qty = parseInt($qtySelector.val().replace(/\D/g, ''));
      var maxQty = $qtySelector.data('max');

      qty = _validateQty(qty);

      // Add or subtract from the current quantity
      if ($el.data('adjust') == 'plus') {
        if (qty >= maxQty) {
          return;
        }else{
          qty += 1;
        }
      } else {
        qty -= 1;
        if (qty <= 1) qty = 1;
      }

      // Update the input's number
      $qtySelector.val(qty).trigger('change');
    });

    $('body').on('change', selectors.qtyInput, function(e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var qty = parseInt($el.val().replace(/\D/g, ''));
      var maxQty = parseInt($el.data('max'))
      
      qty = _validateQty(qty);
      
      if (qty > maxQty) {
        qty = maxQty;
      }else if(qty < 1){
        qty = 1;
      }

      $el.val(qty);
    })
  }

  function _validateQty(qty) {
    if ((parseFloat(qty) === parseInt(qty)) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return qty;
  }

  return {
    init: init
  }
})();
theme.VideoPlayer = (function(){
  var selectors = {
    container: '[js-video-container]',
    video: '[js-video]',
    overlay: '[js-video-overlay]'
  }

  function init() {
    var $containers = $(selectors.container);

    $containers.each(function(){
      bindEvents($(this));
    });
  }

  function bindEvents(container) {
    var $container = container;
    var $video = $container.find(selectors.video);
    var videoEl = $video.get(0);
    var $overlay = $container.find(selectors.overlay);

    videoEl.addEventListener("playing", function() {
      $overlay.hide();
      $video.prop("controls", true);
    })

    videoEl.addEventListener("ended", function() {
      $overlay.show();
      $video.prop("controls", false);
    })

    videoEl.addEventListener("pause", function() {
      $overlay.show();
      $video.prop("controls", false);
    })

    $container.on('click', function(){
      videoEl.play();
      $overlay.hide();
      $video.prop("controls", true);
    })
  }

  return {
    init: init
  }
})();

/*================ Modules ================*/
theme.Header = (function() {
  var selectors = {
    header: '[js-header]'
  }

  function init() {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $(selectors.header).outerHeight();

    $(window).scroll(function(event) {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      var currentPos = $(this).scrollTop();

      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - currentPos) <= delta)
        return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (currentPos > lastScrollTop && currentPos > navbarHeight) {
        // Scroll Down
        $(selectors.header).addClass('hidden');
      } else {
        // Scroll Up
        if (currentPos + $(window).height() < $(document).height()) {
          $(selectors.header).removeClass('hidden');
        }
      }

      lastScrollTop = currentPos;
    }
  }

  return {
    init: init
  }
})();

/*================ Homepage ================*/
theme.HomepageSocial = (function(){
  var selectors = {
    carousel: '[js-homepage-social-carousel]'
  }

  function HomepageSocial(container) {
    this.$container = $(container);
    this.carouselInit();
  }

  HomepageSocial.prototype = $.extend({}, HomepageSocial.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);
      
      $carousel.flickity({
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false
      });
    }
  });

  return HomepageSocial;
})();
theme.HomepageProduct = (function(){
  var selectors = {
    carousel: '[js-homepage-product-carousel]',
    carouselDot: '[js-homepage-product-trigger]',
    imageCarouselPrev: '[js-arrow-prev]',
    imageCarouselNext: '[js-arrow-next]',
    singleOptionSelector: '[data-single-option-selector]',
    productIdSelect: '[data-product-select]',
    modalSelector: '[data-remodal-id]'
  }

  function HomepageProduct(container) {
    this.$container = $(container);
    this.carouselInit();
    this.updateProduct();
    this.initModal();
  }

  HomepageProduct.prototype = $.extend({}, HomepageProduct.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);
      var $prevArrow = $(selectors.imageCarouselPrev, this.$container);
      var $nextArrow = $(selectors.imageCarouselNext, this.$container);
      $carousel.flickity({
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false
      });

      $carousel.on('change.flickity', function(e, index) {
        var slideIndex = index;
        var $targetDot = $(selectors.carouselDot + '[data-index="'+ index +'"]', this.$container).parent()
        $targetDot.addClass('selected').siblings().removeClass('selected')
      })

      var $dot = $(selectors.carouselDot, this.$container);
      $dot.on('click', function(){
        var targetIndex = $(this).data('index');
        $carousel.flickity('select', targetIndex)
      })

      $prevArrow.on('click', function(){
        $carousel.flickity('previous', true);
      })

      $nextArrow.on('click', function(){
        $carousel.flickity('next', true);
      })
    },
    // updateProduct: function(){
    //   var $idSelect = $(selectors.productIdSelect, this.$container)
    //   $(selectors.singleOptionSelector, this.$container).on('change', function(){
    //     var $el = $(this)
    //     $idSelect.val($el.val())
    //   })
    // },
    initModal: function(){
      $(selectors.modalSelector, this.$container).remodal();
    }
  });

  return HomepageProduct;
})();
theme.HomepageEditorials = (function(){
  var selectors = {
    carousel: '[js-editorial-carousel]'
  }

  function HomepageEditorials(container) {
    this.$container = $(container);
    this.carouselInit();
  }

  HomepageEditorials.prototype = $.extend({}, HomepageEditorials.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);
      $carousel.flickity({
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false
      });
    }
  });

  return HomepageEditorials;
})();
theme.HomepageMovement = (function(){
  var selectors = {
    carousel: '[js-movement-carousel]',
    cardImage: '[js-movement-image] .ratio-box img'
  }

  function HomepageMovement(container) {
    this.$container = $(container);
    this.controller = new ScrollMagic.Controller();
    this.carouselInit();
    this.imageShift();
  }

  HomepageMovement.prototype = $.extend({}, HomepageMovement.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);

      enquire.register(theme.config.mediaQueries.mediumDown,{
        match: function(){
          $carousel.flickity({
            wrapAround: false,
            prevNextButtons: false,
            pageDots: false
          });
        },
        unmatch: function(){
          $carousel.flickity('destroy');
        }
      })
    },
    imageShift: function(){
      var imageTween = new TimelineMax().add([
        TweenMax.to(selectors.cardImage, 1, {marginTop: "-12%", ease: Power1.easeInOut})
      ])

      new ScrollMagic.Scene({
        triggerElement: selectors.carousel,
        duration: "70%"
      })
      .setTween(imageTween)
      .addTo(this.controller);
    }
  });

  return HomepageMovement;
})();
theme.HomepageArticles = (function(){
  var selectors = {
    carousel: '[js-carousel]'
  }

  function HomepageArticles(container) {
    this.$container = $(container);
    this.carouselInit();
  }

  HomepageArticles.prototype = $.extend({}, HomepageArticles.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);
      
      enquire.register(theme.config.mediaQueries.mediumDown,{
        match: function(){
          $carousel.flickity({
            wrapAround: false,
            prevNextButtons: false,
            pageDots: false,
            cellAlign: 'left',
            contain: true
          });
        },
        unmatch: function(){
          $carousel.flickity('destroy');
        }
      })
    }
  });

  return HomepageArticles;
})();
theme.HomepageProductCarousel = (function(){
  var selectors = {
    carousel: '[js-product-carousel]',
    carouselDot: '[js-homepage-product-trigger]',
    imageCarouselPrev: '[js-arrow-prev]',
    imageCarouselNext: '[js-arrow-next]'
  }

  function HomepageProductCarousel(container) {
    this.$container = $(container);
    this.carouselInit();
  }

  HomepageProductCarousel.prototype = $.extend({}, HomepageProductCarousel.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);
      var $prevArrow = $(selectors.imageCarouselPrev, this.$container);
      var $nextArrow = $(selectors.imageCarouselNext, this.$container);
      $carousel.flickity({
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false,
        imagesLoaded: true
      });

      $carousel.on('change.flickity', function(e, index) {
        var slideIndex = index;
        var $targetDot = $(selectors.carouselDot + '[data-index="'+ index +'"]', this.$container).parent()
        $targetDot.addClass('selected').siblings().removeClass('selected')
      })

      var $dot = $(selectors.carouselDot, this.$container);
      $dot.on('click', function(){
        var targetIndex = $(this).data('index');
        $carousel.flickity('select', targetIndex)
      })

      $prevArrow.on('click', function(){
        $carousel.flickity('previous', true);
      })

      $nextArrow.on('click', function(){
        $carousel.flickity('next', true);
      })
    }
  });

  return HomepageProductCarousel;
})();

/*================ Product ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    productImageCarousel: '[js-product-carousel]',
    productImageCarouselDot: '[js-image-carousel-trigger]',
    productImageCarouselPrev: '[js-arrow-prev]',
    productImageCarouselNext: '[js-arrow-next]',
    subscriptionRadio: '[js-subscription-radio]',
    modalSelector: '[data-remodal-id]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    this.$container.on('variantChange' + this.namespace, this.changeImageSlider.bind(this));


    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }

    this.imageCarouselInit();
    this.initModal();

    $(selectors.subscriptionRadio, this.$container).on('change', this.updateSubscription.bind(this))
  }

  Product.prototype = $.extend({}, Product.prototype, {
    updateSubscription: function(e) {
      var $idSelect = $(selectors.originalSelectorId, this.$container);
      $idSelect.val($(e.currentTarget).val())
    },
    initModal: function(){
      $(selectors.modalSelector, this.$container).remodal();
    },


    changeImageSlider: function(evt) {
      var variant = evt.variant;

      if(variant === null) {
        return
      }

      var $carousel = $(selectors.productImageCarousel, this.$container);
      var imageIndex = Array.from( 
        $carousel.find('.product-carousel__image img')).findIndex((item) => item.dataset.variantIds.includes(variant.id))
        if(imageIndex === -1) {
          return
        }
        $carousel.flickity('select', imageIndex)


    },

    imageCarouselInit: function(evt) {
      var $carousel = $(selectors.productImageCarousel, this.$container);
      var $prevArrow = $(selectors.productImageCarouselPrev, this.$container);
      var $nextArrow = $(selectors.productImageCarouselNext, this.$container);

      
      $carousel.flickity({
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false
      });

      $carousel.on('change.flickity', function(e, index) {
        var slideIndex = index;
        var $targetDot = $(selectors.productImageCarouselDot + '[data-index="'+ index +'"]', this.$container).parent()
        $targetDot.addClass('selected').siblings().removeClass('selected')
      })

      var $dot = $(selectors.productImageCarouselDot, this.$container);
      $dot.on('click', function(){
        var targetIndex = $(this).data('index');
        $carousel.flickity('select', targetIndex)
      })

      $prevArrow.on('click', function(){
        $carousel.flickity('previous', true);
      })

      $nextArrow.on('click', function(){
        $carousel.flickity('next', true);
      })
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();

theme.ProductDetails = (function(){
  var selectors = {
    container: '[js-details-container]',
    background: '[js-details-background]',
    detailsCard: '[js-details-card]',
    detailsAnchor: '[js-details-anchor]'
  }

  function ProductDetails(container) {
    this.$container = $(container);
    this.initPinBackground();
    this.initScrollMarker();
  }

  ProductDetails.prototype = $.extend({}, ProductDetails.prototype, {
    initPinBackground: function(container){
      var pinController = new ScrollMagic.Controller();
      var pinScene = null;
      enquire.register(theme.config.mediaQueries.smallDown,{
        match: function(){
          if (pinScene != null) {
            pinScene = pinScene.destroy(true);
            pinScene = null;
          }
          pinScene = new ScrollMagic.Scene({
            triggerElement: selectors.container,
            triggerHook: 0,
            duration: 640
          })
          .setPin(selectors.background)
          .addTo(pinController);
        }
      }).register(theme.config.mediaQueries.medium,{
        match: function(){
          if (pinScene != null) {
            pinScene = pinScene.destroy(true);
            pinScene = null;
          }
          pinScene = new ScrollMagic.Scene({
            triggerElement: selectors.container,
            triggerHook: 0,
            duration: 612
          })
          .setPin(selectors.background)
          .addTo(pinController);
        }
      }).register(theme.config.mediaQueries.largeUp,{
        match: function(){
          if (pinScene != null) {
            pinScene = pinScene.destroy(true);
            pinScene = null;
          }
          pinScene = new ScrollMagic.Scene({
            triggerElement: selectors.container,
            triggerHook: 0,
            duration: 730
          })
          .setPin(selectors.background)
          .addTo(pinController);
        }
      })
    },
    initScrollMarker: function(){
      var cards = $(selectors.detailsCard, this.$container);
      var anchors = $(selectors.detailsAnchor, this.$container);
      var scenes = new Array(cards.length).fill(null);
      var bgColors = new Array(cards.length).fill(null);
      var scrollController = new ScrollMagic.Controller();

      enquire.register(theme.config.mediaQueries.smallDown,{
        match: function(){
          for (var i = 0; i < cards.length; i++) {
            if (scenes[i] != null) {
              scenes[i] = scenes[i].destroy(true);
              scenes[i] = null;
            }

            if (bgColors[i] != null) {
              bgColors[i] = bgColors[i].destroy(true);
              bgColors[i] = null;
            }

            bgColors[i] = new ScrollMagic.Scene({
              triggerElement: cards[i],
              triggerHook: -200,
              offset: -200,
              duration: $(cards[i]).outerHeight()+40
            })
            .setClassToggle(selectors.container, 'product__details--'+i)
            .addTo(scrollController);
          }
        }
      }).register(theme.config.mediaQueries.medium,{
        match: function(){
          for (var i = 0; i < cards.length; i++) {
            if (scenes[i] != null) {
              scenes[i] = scenes[i].destroy(true);
              scenes[i] = null;
            }
            if (bgColors[i] != null) {
              bgColors[i] = bgColors[i].destroy(true);
              bgColors[i] = null;
            }

            scenes[i] = new ScrollMagic.Scene({
              triggerElement: cards[i],
              triggerHook: -200,
              offset: -200,
              duration: $(cards[i]).outerHeight()+40
            })
            .setClassToggle(anchors[i], 'active')
            .addTo(scrollController);

            bgColors[i] = new ScrollMagic.Scene({
              triggerElement: cards[i],
              triggerHook: -200,
              offset: -200,
              duration: $(cards[i]).outerHeight()+40
            })
            .setClassToggle(selectors.container, 'product__details--'+i)
            .addTo(scrollController);
          }
        }
      }).register(theme.config.mediaQueries.largeUp,{
        match: function(){
          for (var i = 0; i < cards.length; i++) {
            if (scenes[i] != null) {
              scenes[i] = scenes[i].destroy(true);
              scenes[i] = null;
            }
            if (bgColors[i] != null) {
              bgColors[i] = bgColors[i].destroy(true);
              bgColors[i] = null;
            }

            scenes[i] = new ScrollMagic.Scene({
              triggerElement: cards[i],
              triggerHook: -200,
              offset: -200,
              duration: $(cards[i]).outerHeight()+80
            })
            .setClassToggle(anchors[i], 'active')
            .addTo(scrollController);

            bgColors[i] = new ScrollMagic.Scene({
              triggerElement: cards[i],
              triggerHook: -200,
              offset: -200,
              duration: $(cards[i]).outerHeight()+80
            })
            .setClassToggle(selectors.container, 'product__details--'+i)
            .addTo(scrollController);
          }
        }
      })
    }
  });

  return ProductDetails;
})();
theme.ProductIcons = (function(){
  var selectors = {
    carousel: '[js-carousel]'
  }

  function ProductIcons(container) {
    this.$container = $(container);
    this.carouselInit();
  }

  ProductIcons.prototype = $.extend({}, ProductIcons.prototype, {
    carouselInit: function(){
      var $carousel = $(selectors.carousel, this.$container);

      enquire.register(theme.config.mediaQueries.mediumDown,{
        match: function(){
          $carousel.flickity({
            wrapAround: false,
            prevNextButtons: false,
            pageDots: false,
            contain: true,
            cellAlign: 'left'
          });
        },
        unmatch: function(){
          console.log('unmatch')
          $carousel.flickity('destroy');
        }
      })
    }
  });

  return ProductIcons;
})();

/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#address_form_new');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  $('[js-address-edit]').on('click', function() {
    var formId = $(this).data('form-id');
    $('#address_form_' + formId).toggle();
    $('.account-address__edit').toggle();
    $('.account-address__listing').toggle();
  });

  $('[js-address-delete]').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '[js-show-recover]',
    hideRecoverPasswordLink: '[js-hide-recover]'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('.login__recover').toggle();
    $('.login__login').toggle();
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();

theme.AccountDashboard = (function(){
  function AccountDashboard(container) {
    this.$container = $(container);

    enquire.register(theme.config.mediaQueries.smallDown,{
      match: function(){
        $('#account__orders', this.$container).attr('aria-hidden', true);
        $('[aria-controls="account__overview"]', this.$container).attr('aria-expanded', true);
      },
      unmatch: function(){
        $('.account__accordion-header', this.$container).attr('aria-expanded', false)
        $('#account__orders, #account__overview', this.$container).removeAttr('aria-hidden').removeAttr('style')
      }
    })
  }

  return AccountDashboard;
})();

theme.AccountAddress = (function(){
  function AccountAddress(container) {
    this.$container = $(container);
    
    enquire.register(theme.config.mediaQueries.smallDown,{
      match: function(){
        $('#account-address-new', this.$container).attr('aria-hidden', true);
        $('[aria-controls="account-address-new"]', this.$container).attr('aria-expanded', false);
      },
      unmatch: function(){
        $('.account__accordion-header', this.$container).attr('aria-expanded', true)
        $('#account-address-new, #account-address-list', this.$container).removeAttr('aria-hidden').removeAttr('style')
      }
    })
  }

  return AccountAddress;
})();
theme.Cart = (function(){
  var selectors = {
    cartForm: '[js-cart-form]',
    cartSubtotal: '[js-cart-subtotal]',
    checkoutButton: '[js-cart-checkout]',
    lineItem: '[js-cart-product]',
    itemQuantity: '[js-qty-num]',
    bagCounter: '[js-bag-count]',
    changeTrigger: '[js-change-subscription]'
  }

  function Cart(container) {
    this.$container = $(container);
    this.$cartForm = $(selectors.cartForm, this.$container);

    if (this.$cartForm.length < 1) {
      return;
    }

    this.$checkoutButton = $(selectors.checkoutButton, this.$container);
    this.$itemQuantity = $(selectors.itemQuantity, this.$container);
    this.$removeProduct = $(selectors.removeProduct, this.$container);
    this.$cartSubtotal = $(selectors.cartSubtotal, this.$container);
    this.$upsell = $(selectors.checkoutUpsell, this.$container);
    this.$bagCounter = $(selectors.bagCounter);
    this.$changeTrigger = $(selectors.changeTrigger, this.$container)

    this.$itemQuantity.on('change', this.quantityAdjust.bind(this));
    this.$changeTrigger.on('click', this.changeSubscription.bind(this));
  }

  Cart.prototype = $.extend({}, Cart.prototype, {
    cartReset: function(cart){
      var countStr;
      if (cart.item_count == 0) {
        this.$cartForm.remove();
        this.$container.append('<div class="cart__empty"><div class="supports-cookies"><p>You have no items in your shopping bag.</p><a href="/" class="btn cart-empty__btn" data-text="Continue Shopping" aria-label="Continue Shopping" >Continue Shopping</a></div><div class="supports-no-cookies"><p>' + theme.strings.cookiesRequired + '</p></div></div>')
      }else{
        this.$checkoutButton.removeAttr('disabled');
        $('.is-updating').removeClass('is-updating');
        this.$cartSubtotal.html(slate.Currency.formatMoney(cart.total_price, theme.moneyFormat))
      }

      if(cart.item_count < 10){
        cartStr = '0' + cart.item_count
      }else{
        cartStr = cart.item_count
      }
      this.$bagCounter.html(cartStr)
    },
    quantityAdjust: function(e){
      e.preventDefault();
      var cartPage = this;
      var $qtyInput = $(e.currentTarget);
      var $lineItem = $qtyInput.closest(selectors.lineItem);
      var qty = $qtyInput.val();
      var line = $qtyInput.data('item-line');

      if (qty == 0) {
        window.location.href = '/cart/change?line='+line+'&quantity=0'
      }

      this.$checkoutButton.attr('disabled', 'disabled')
      $lineItem.addClass('is-updating');
      $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: {
          quantity: qty,
          line: line
        },
        dataType: 'json',
        async: false,
        success: function(cart){
          cartPage.cartReset(cart);
        },
        error: function (err) {
          console.log('quantity change failed')
          alert(err.responseJSON.message + ': ' + err.responseJSON.description);
        }
      })
    },
    changeSubscription: function(e){
      e.preventDefault();
      var $el = $(e.currentTarget);
      var currentId = $el.data('current-id');
      var targetId = $el.data('target-id');
      var qty = parseInt($el.closest(selectors.lineItem).find(selectors.itemQuantity).val());
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          id: targetId,
          quantity: qty
        },
        dataType: 'json',
        async: false,
        success: function(cart){
          $.ajax({
            type: 'POST',
            url: '/cart/change.js',
            data: {
              id: currentId,
              quantity: 0
            },
            dataType: 'json',
            async: false,
            success: function(cart){
              location.reload();
            },
            error: function(err) {
              console.log('remove failed')
              alert(err.responseJSON.message + ': ' + err.responseJSON.description);
            }
          })
        },
        error: function (err) {
          console.log('add recurring failed')
          alert(err.responseJSON.message + ': ' + err.responseJSON.description);
        }
      })
    }
  });

  return Cart;
})();

function initCartSlide(){
  document.querySelectorAll('.js-slide--cart .js-qty__adjust').forEach(i =>{
    i.addEventListener('click', function (e){
      var input = this.parentElement.querySelector(".js-qty__num")
      if(this.classList.contains('js-qty__adjust--plus')){
          var count = parseInt(input.value) + 1;
          input.value = count;
        }
      else{
        var count = parseInt(input.value) - 1;
        count = count < 1 ? 1 : count;
        input.value = count;
      }
      const item = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        'id': input.dataset.variantId.toString(),
        'quantity' : input.value
        })
      }
      fetch('/cart/change.js', item).then((response)=>response.json()).then(function(cart){
        $('#shopify-section-cart-slide').html($(cart.sections['cart-slide']).find('.js-slide--cart'))
        document.querySelector('.site-header__bag-count').innerText = cart.item_count
      }).then(() => initCartSlide())
      .catch(error => {
        console.log(error)
      })
      
    })
  })
  document.querySelectorAll('.slide-cart-product__remove').forEach(i =>{
    i.addEventListener('click', function (e){
         const item = {
          method: 'POST',
          credentials: "same-origin",
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json;'
          },
          body:JSON.stringify({
          sections: 'cart-slide',
          'id': this.dataset.variantKey.toString(),
          'quantity' : 0
          })
        }
        fetch('/cart/change.js', item).then((response)=>response.json()).then(function(cart){
        $('#shopify-section-cart-slide').html($(cart.sections['cart-slide']).find('.js-slide--cart'))
        document.querySelector('.site-header__bag-count').innerText = cart.item_count
        }).then(() => initCartSlide())
        .catch(error => {
          console.log(error)
        })
    })
  })
  document.querySelectorAll('.subscription__btn').forEach(i =>{
    i.addEventListener('click', function (e){
      var quantity = this.parentElement.querySelector('.js-qty__num').value;
      var variant_id = this.dataset.variantId;
      var sub_id = this.dataset.sub;
            
      // jQuery.getJSON('/cart.js').then(function(cart) {
      //   var current_product = cart.items.find(key => key.id == variant_id);
      //   console.log(current_product)
      // })
      const item = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        "id": sub_id,
        "quantity" : quantity,
        "properties": {
          "shipping_interval_frequency": "15",
          "shipping_interval_unit_type": "day"
        }
        })
      }
      const item_remove = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        "id": variant_id,
        "quantity" : 0,
        })
      }
      fetch('/cart/change.js', item_remove).then(() => fetch('/cart/add.js', item)).then((response)=>response.json())
      .then(cart => $('#shopify-section-cart-slide').html($(cart.sections['cart-slide']).find('.js-slide--cart')))
      .then(() => initCartSlide())
      .catch(error => {
        console.log(error)
      })
    })
  })



  let selectValueSubsccribe =  document.querySelectorAll('.subscribtion-values');
  selectValueSubsccribe.forEach(item => {
    item.addEventListener('change', function() {
      let qt = document.querySelector('.js-qty__num').value;
      let select_id = this.dataset.selectedId;
      let select_value = this.value
          
      const item_subscribe = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        "id": select_id,
        "quantity" : qt,
        "properties": {
          "shipping_interval_frequency": select_value,
          "shipping_interval_unit_type": "day"
        }
        })
      }

      const item_cancel = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        "id": select_id,
        "quantity" : 0,
        })
      }

      fetch('/cart/change.js', item_cancel).then(() => fetch('/cart/add.js', item_subscribe)).then((response)=>response.json())
      .then(cart => $('#shopify-section-cart-slide').html($(cart.sections['cart-slide']).find('.js-slide--cart')))
      .then(() => initCartSlide())
      .catch(error => {
        console.log(error)
      })

    })
  })


  document.querySelectorAll('.current-product__select').forEach(item => {
    item.addEventListener('change', function() {
      let qtt = document.querySelector('.js-qty__num').value;
      let variant_idd = this.dataset.selectedId;
      let selected_id = this.value
      console.log('ll',selected_id)
  
      const item_valu_new = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        "id": selected_id,
        "quantity" : qtt
        })
      }
  
      const item_variant_remove = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        },
        body:JSON.stringify({
        sections: 'cart-slide',
        "id": variant_idd,
        "quantity" : 0,
        })
      }
  
      fetch('/cart/change.js', item_variant_remove).then(() => fetch('/cart/add.js', item_valu_new)).then((response)=>response.json())
      .then(cart => $('#shopify-section-cart-slide').html($(cart.sections['cart-slide']).find('.js-slide--cart')))
      .then(() => initCartSlide())
      .catch(error => {
        console.log(error)
      })
  })
    
  })


   function selectSuscribtionValues() {
      fetch('/cart.js')
        .then((response)=>response.json())
        .then(data => {
          let selectSubsccribe =  document.querySelectorAll('.subscribtion-values');
            selectSubsccribe.forEach((item,index) => {
          item.value = data.items[index].properties.shipping_interval_frequency
          console.log('cart fetch',data.items[index].properties.shipping_interval_frequency)
        })
          
    })
  }



  jQuery.post('/cart/update.js', selectSuscribtionValues);



  
  jQuery.getJSON('/cart.js').then(Cart => {
    //slate.Currency.formatMoney(Cart.total_price)
    var sum_shipping = document.querySelector('[data-sum-free]').dataset.sumFree;
    var pre_cent = Cart.total_price / 10000 * 100;
    if(sum_shipping >= Cart.total_price){
      console.log(pre_cent.toFixed(2))
      document.querySelector('.progress .progress_inner').style.width = pre_cent.toFixed(2) + '%'
    }
    Cart.items.forEach((item) => {
      if(item.selling_plan_allocation != undefined){
        array_selling = true;
      }
    })
  })
  document.querySelector('.close-slide-cart').addEventListener('click', function (){
    document.querySelector('html').classList.remove('js-open-cart')
  })
  document.querySelector('.cart-continue').addEventListener('click', function (){
    document.querySelector('html').classList.remove('js-open-cart')
  })
}
theme.SlideCart = (function(){
  document.querySelector('.site-header__bag').addEventListener('click', function (e){
    initCartSlide()
    e.preventDefault();
    document.querySelector('html').classList.toggle('js-open-cart');
  })
  document.addEventListener("click", (e) => {
    if (e.target.classList[0] == 'background-overlay' && document.querySelector('html').classList.contains("js-open-cart")) {
      document.querySelector('html').classList.toggle('js-open-cart')
    }
  });

  function buildCheckoutUrl() {
    function get_cart_token() {
      // Build the cart_token param for the URL generator
      try {
        return ['cart_token=' + (document.cookie.match('(^|; )cart=([^;]*)')||0)[2]];
      } catch (e) {
        return [];
      }
    }
    function get_ga_linker() {
      // Build the ga_linker param for the URL generator
      try {
        return [ga.getAll()[0].get('linkerParam')];
      } catch (e) {
        return [];
      }
    }

    var options = customRecharge.cart_options
    // Build the Checkout URL
    var checkout_url = 'https://' + options.checkout_domain + '/r/checkout?',
      url_params = [
        'myshopify_domain=' + options.permanent_domain,
      ];
    url_params = url_params
      .concat(get_cart_token())
      .concat(get_ga_linker());
    return checkout_url + url_params.join('&');
  }

  document.addEventListener('click', (e) => {
    console.log('btn')
    if (!e.target.classList.contains('cart__button--sidebar')) {
      return
    }
    e.preventDefault()
    fetch('/cart.js')
    .then((response)=>response.json())
    .then(data => {
        if (JSON.stringify(data).includes('shipping_interval_frequency')) {
          window.location.href = buildCheckoutUrl()
         console.log('url')
        } else {
          window.location.href = '/checkout'
         console.log('else')
        }
      })
  })


})();
theme.Blog = (function(){
  var selectors = {
    headerCarousel: '[js-header-carousel]',
    carouselDot: '[js-dot-trigger]',
    carouselPrev: '[js-arrow-prev]',
    carouselNext: '[js-arrow-next]',
    infiniteContainer: '[js-articles]',
    infiniteObject: '[js-article]',
    paginationPath: '[js-pagination-path]'
  }

  function Blog(container) {
    this.$container = $(container);
    this.controller = new ScrollMagic.Controller();
    var $headerCarousel = $(selectors.headerCarousel, this.$container);
    
    if ($headerCarousel.length > 0) {
      this.initCarousel();
    }

    this.initInfinite();
  }

  Blog.prototype = $.extend({}, Blog.prototype, {
    initCarousel: function(){
      var $carousel = $(selectors.headerCarousel, this.$container);
      var $prevArrow = $(selectors.carouselPrev, this.$container);
      var $nextArrow = $(selectors.carouselNext, this.$container);
      $carousel.flickity({
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false
      });

      $carousel.on('change.flickity', function(e, index) {
        var slideIndex = index;
        var $targetDot = $(selectors.carouselDot + '[data-index="'+ index +'"]', this.$container).parent()
        $targetDot.addClass('selected').siblings().removeClass('selected')
      })

      var $dot = $(selectors.carouselDot, this.$container);
      $dot.on('click', function(){
        var targetIndex = $(this).data('index');
        $carousel.flickity('select', targetIndex)
      })

      $prevArrow.on('click', function(){
        $carousel.flickity('previous', true);
      })

      $nextArrow.on('click', function(){
        $carousel.flickity('next', true);
      })
    },
    initInfinite: function(){
      var $infiniteArticles = $(selectors.infiniteContainer, this.$container);
      $infiniteArticles.infiniteScroll({
        path: selectors.paginationPath,
        append: selectors.infiniteObject,
        history: false,
        button: '[js-pagination-path]',
        scrollThreshold: false
      })
    }
  });

  return Blog;
})();

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
  sections.register('account-dashboard', theme.AccountDashboard);
  sections.register('account-address', theme.AccountAddress);

  sections.register('homepage-social', theme.HomepageSocial);
  sections.register('homepage-product', theme.HomepageProduct);
  sections.register('homepage-editorials', theme.HomepageEditorials);
  sections.register('homepage-movement', theme.HomepageMovement);
  sections.register('homepage-articles', theme.HomepageArticles);
  sections.register('homepage-product-carousel', theme.HomepageProductCarousel);

  sections.register('product-details', theme.ProductDetails);
  sections.register('product-icons', theme.ProductIcons);

  sections.register('blog', theme.Blog);

  sections.register('cart', theme.Cart);
  //sections.register('slide_cart', theme.SlideCart);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  theme.Accordion.init();
  theme.Tabs.init();
  theme.QuantitySelectors.init();
  
  theme.Header.init();
  theme.MobileNav.init();
  theme.VideoPlayer.init();
});


//Remove duplicate from cart

let productSlideCart = document.querySelectorAll('.slide-cart__product')
let producRecomendationCart = document.querySelectorAll('.recommended-product')

/* function removeDuplicateCart() {
 producRecomendationCart.forEach(item => {
    productSlideCart.forEach(item2 => {
      if(item.dataset.recom == item2.dataset.id) {
        item.style.display = 'none'
      }
    })
 })
}

removeDuplicateCart()
 */
// Duplicate information from cart slide to cart page
let cartFreeShipping = document.querySelector('.cart__free-shipping')
let slideCartFreeShipping = document.querySelector('.free-shipping-text')
if (slideCartFreeShipping && cartFreeShipping)
  cartFreeShipping.innerHTML = slideCartFreeShipping.innerHTML


 
  
 
