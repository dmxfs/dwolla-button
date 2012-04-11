var DwollaBtn = DwollaBtn || (function(){
    var _args = {
    	cssURI: 'button.css', // This should point to where the css file lives
    	dwollaPayAction: 'https://www.dwolla.com/payment/pay' // This should point to Dwolla's Payment endpoint
    };

    return {
        init : function() {
        	// Append CSS
        	this.appendCSS();

            // Style buttons
            this.styleButtons();

        	// Bind buttons
        	this.registerButtons();
        },
        appendCSS: function() {
        	// Create the button <link> tag
        	var cssFile = document.createElement('link');
            cssFile.setAttribute('rel', 'stylesheet');
            cssFile.setAttribute('type', 'text/css');
            cssFile.setAttribute('href', _args.cssURI);

        	// Append the tag to the <head>
            document.getElementsByTagName('head')[0].appendChild(cssFile);
        },
        styleButtons: function() {
        	// Iterate thru every dwolla button on the page
            var els = document.getElementsByClassName('dwolla_button');

            for(i=0 ; i<els.length ; i++) {
                var btn = els[i],
                    amount = btn.getAttribute('data-amount');

                // Wrap link text in a <span>
                var btnText = document.createElement('span');
                btnText.setAttribute('class', 'd-btn-text');
                btnText.appendChild( document.createTextNode(btn.firstChild.nodeValue) );
                btn.replaceChild(btnText, btn.firstChild)

                // Add the arrow icon
                var btnIcon = document.createElement('span');
                btnIcon.setAttribute('class', 'd-btn-icon');
                btn.appendChild(btnIcon);

                // Add the d-btn class
                btn.className += " d-btn";
            }
        },
        registerButtons: function() {
            // Helper function to determine whether
            // a dwolla button was clicked
            var isDBtn = function(el, parent_el) {
                var check = function(e) { return (e.className.indexOf('d-btn') !== -1) && e.nodeName == "A" }

                if (check(el)) {
                    return el;
                }
                else if (check(parent_el)) {
                    return parent_el;
                }

                return false;
            }

            // Mimic jQuery's .live method
            document.onclick = function(e) {
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
                            destinationId: el.getAttribute('data-dest'),
                            amount: el.getAttribute('data-amount'),
                            shipping: el.getAttribute('data-shipping'),
                            tax: el.getAttribute('data-tax'),
                            name: el.getAttribute('data-name'),
                            desc: el.getAttribute('data-desc'),
                            redirect: el.getAttribute('href'),
                            key: el.getAttribute('data-key')
                        };
                    for(key in inputs) {
                        var input = document.createElement("input");

                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', key);
                        input.setAttribute('value', inputs[key]);

                        form.appendChild(input);
                    }

                    // Put the form in the body and submit
                    document.getElementsByTagName('body')[0].appendChild(form);
                    //form.submit();
                    alert('a');

                    // Don't continue to the href
                    return false;                    
                }
            };
        }
    };
}());

DwollaBtn.init();