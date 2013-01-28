(function (window) {
window.DOMReady = (function () {
	// Private vars
	var fns = [],
		isReady = false,
		errorHandler = null,
		run = function (fn, args) {
			try {
				// call function
				fn.apply(this, args || []);
			} catch(err) {
				// error occured while executing function
				if (errorHandler)
					errorHandler.call(this, err);
			}
		},
		ready = function () {
			isReady = true;

			// call all registered functions
			for (var x = 0; x < fns.length; x++)
				run(fns[x].fn, fns[x].args || []);

			// clear handlers
			fns = [];
		};

	/**
	 * Set error handler
	 * @static
	 * @param {Function} fn
	 * @return {DOMReady} For chaining
	 */
	this.setOnError = function (fn) {
		errorHandler = fn;

		// return this for chaining
		return this;
	};

	/**
	 * Add code or function to execute when the DOM is ready
	 * @static
	 * @param {Function} fn
	 * @param {Array} args Arguments will be passed on when calling function
	 * @return {DOMReady} For chaining
	 */
	this.add = function (fn, args) {
		// call imediately when DOM is already ready
		if (isReady) {
			run(fn, args);
		} else {
			// add to the list
			fns[fns.length] = {
				fn: fn,
				args: args
			};
		}

		// return this for chaining
		return this;
	};

	// for all browsers except IE
	if (window.addEventListener) {
		window.document.addEventListener('DOMContentLoaded', function () { ready(); }, false);
	} else {
		// for IE
		// code taken from http://ajaxian.com/archives/iecontentloaded-yet-another-domcontentloaded
		(function(){
			// check IE's proprietary DOM members
			if (!window.document.uniqueID && window.document.expando)
				return;

			// you can create any tagName, even customTag like <document :ready />
			var tempNode = window.document.createElement('document:ready');

			try {
				// see if it throws errors until after ondocumentready
				tempNode.doScroll('left');

				// call ready
				ready();
			} catch (err) {
				setTimeout(arguments.callee, 0);
			}
		})();
	}

	return this;

})();
})(window);

/**
 * Dwolla Paymeny Button Help Script
 *
 * @version 2.0.0
 */
var DwollaBtn = DwollaBtn || (function () {
    var _args = {
        cssURI: 'https://www.dwolla.com/content/button.min.css', // This should point to where the css file lives
        dwollaPayAction: 'https://www.dwolla.com/payment/pay' // This should point to Dwolla's Payment endpoint
    };

    return {
        init: function () {
        	// Don't init twice...
        	if (window.isDwollaReady) {
	        	return false;
        	}

            // Note that we're already init'd
            window.isDwollaReady = true;

            // Append CSS
            this.appendCSS();

            // Style buttons
            this.styleButtons();

            // Bind buttons
            this.registerButtons();

            // Handle gateway response
            this.handleResponse();

            // All done
            return true;
        },
        appendCSS: function () {
            // Create the button <link> tag
            var cssFile = document.createElement('link');
            cssFile.setAttribute('rel', 'stylesheet');
            cssFile.setAttribute('type', 'text/css');
            cssFile.setAttribute('href', _args.cssURI);

            // Append the tag to the <head>
            document.getElementsByTagName('head')[0].appendChild(cssFile);
        },
        styleButtons: function () {
            // Iterate thru every dwolla button on the page
            var els = document.getElementsByClassName('dwolla_button');

            for(i = 0; i < els.length; i++) {
                var btn = els[i],
                    amount = btn.getAttribute('data-amount');

                if(btn.className.indexOf('d-btn') === -1) {
	                // Wrap link text in a <span>
	                var btnText = document.createElement('span');
	                btnText.setAttribute('class', 'd-btn-text');
	                btnText.setAttribute('id', 'd-btn-text');
	                btnText.appendChild(document.createTextNode(btn.firstChild.nodeValue));
	                btn.replaceChild(btnText, btn.firstChild);
	
	                // Add the arrow icon
	                var btnIcon = document.createElement('span');
	                btnIcon.setAttribute('class', 'd-btn-icon');
	                btn.appendChild(btnIcon);
	
	                // Add the d-btn class
	                btn.className += ' d-btn';
                }
            }
        },
        registerButtons: function () {
            // Helper function to determine whether
            // a dwolla button was clicked
            var isDBtn = function (el, parent_el) {
                var check = function (e) { return (e.className.indexOf('d-btn') !== -1) && e.nodeName == "A" }

                if (check(el)) {
                    return el;
                } else if (check(parent_el)) {
                    return parent_el;
                }

                return false;
            };

            // Mimic jQuery's .live method
            var clickFn = function (e) {
                // Check both the clicked element
                // and its parent, since we have a 1-level
                // nested button
                var click_el = e.target,
                    parent_el = e.target.parentNode,
                    el;

                if (el = isDBtn(click_el, parent_el)) {
                    // Avoid any unwanted actions from the
                    // button element
                    e.preventDefault();

                    // Create a dynamic form
                    var form = document.createElement("form");

                    // Config the form
                    form.setAttribute('method', 'POST');
                    form.setAttribute('action', _args.dwollaPayAction);

                    // Create and append inputs
                    var inputs = {
                        destinationId: null,
                        amount: el.getAttribute('data-amount'),
                        shipping: el.getAttribute('data-shipping'),
                        tax: el.getAttribute('data-tax'),
                        name: el.getAttribute('data-name'),
                        description: el.getAttribute('data-desc'),
                        redirect: el.getAttribute('href'),
                        key: el.getAttribute('data-key'),
                        orderId: el.getAttribute('data-orderid'),
                        facilitatorAmount: el.getAttribute('data-facilitator-fee'),
                        notes: el.getAttribute('data-notes'),
                        test: el.getAttribute('data-test'),
                        allowFundingSources: el.getAttribute('data-guest-checkout')
                    };
                    for (key in inputs) {
                    	if(inputs[key] != null) {
	                        var input = document.createElement("input");
	
	                        input.setAttribute('type', 'hidden');
	                        input.setAttribute('name', key);
	                        input.setAttribute('value', inputs[key]);
	
	                        form.appendChild(input);
                    	}
                    }

                    // Put the form in the body and submit
                    document.getElementsByTagName('body')[0].appendChild(form);
                    form.submit();

                    // Don't continue to the href
                    return false;
                }
            };

            document.addEventListener('click', clickFn);
        },
        handleResponse: function() {
			var getParameterByName = function(name) {
			    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
			    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
			};

			if(getParameterByName('error') == 'failure' && getParameterByName('error_description')) {
				alert('There seemed to have been a problem with the transaction. Dwolla said: ' + getParameterByName('error_description'));
			}

			return true;
        }
    };
} ());

DOMReady.add(function (){
  // Grab immediate Dwolla buttons
	DwollaBtn.init();

	// Refresh buttons on DOM changes
	document.addEventListener('DOMSubtreeModified', function() {
    DwollaBtn.init();
  });
});