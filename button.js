var DwollaBtn = DwollaBtn || (function(){
    var _args = {
    	cssURI: 'button.css', // This should point to where the css file lives
    	dwollaPayAction: 'https://www.dwolla.com/payment/pay' // This should point to Dwolla's Payment endpoint
    };

    return {
        init : function() {
        	// Append CSS
        	this.appendCSS();

        	// Bind buttons
        	this.registerButtons();

        	// Style buttons
        	this.styleButtons();
        },
        appendCSS: function() {
        	// Create the <link> tag
        	var cssFile = $('<link/>', {
        		'rel': 'stylesheet',
        		'type': 'text/css',
        		'href': _args.cssURI
        	});

        	// Append the tag to the <head>
        	$('head').append(cssFile);
        },
        styleButtons: function() {
        	// Iterate thru every dwolla button on the page
        	$('.dwolla_button').each(function() {
        		var el = $(this),
	        		styledBtn = el.clone(),
        			amount = el.attr('data-amount');

        		// Create the animated button's different elements
        		var btnText = $('<span/>', { 'class': 'd-btn-text', 'html': el.html()}),
        			btnSlideText = $('<span/>', { 'class': 'd-btn-slide-text', 'html': '$' + amount}),
        			btnIcon = $('<span/>', { 'class': 'd-btn-icon-right', 'html': '<span></span>'});

        		// Append the various elements to the styled button element
        		styledBtn
        			.empty()
        			.append(btnText)
        			.append(btnSlideText)
        			.append(btnIcon)
        			.addClass('d-btn')
        			.unbind('mouseover mouseout') // Clear out any old listeners
        			.bind({ // Register hover listeners
        				mouseover: function() {
        					// Expand button to fit price text
        					styledBtn
        						.css({'padding-right': 80 + (amount.length * 15)})
        						.find('.d-btn-slide-text').width(amount.length * 15);
        				},
        				mouseout: function() {
        					styledBtn
        						.css({'padding-right': 80})
        						.find('.d-btn-slide-text').width(0);
        				}
        			})

        		// Finally, replace the old button with 
        		// the new styled one
        		el.replaceWith(styledBtn);
        	})
        },
        registerButtons: function() {
        	$('.dwolla_button')
        	.unbind('click.DwollaBtn') // Clear out any old listeners
        	.live('click.DwollaBtn', function(e) { // Register our listener in our namespace
        		// Avoid any unwanted actions from the
        		// button element
        		e.preventDefault();

        		// Create a dynamic form
        		var el = $(this),
        			form = $('<form/>', {
        				'method': 'POST',
        				'action': _args.dwollaPayAction
	        		});

	        	// Create and append inputs
	        	var inputs = {
		        		destinationId: el.attr('data-dest'),
		        		amount: el.attr('data-amount'),
		        		shipping: el.attr('data-shipping'),
		        		tax: el.attr('data-tax'),
		        		name: el.attr('data-name'),
		        		desc: el.attr('data-desc'),
		        		redirect: el.attr('href'),
		        		key: el.attr('data-key')
		        	};
	        	for(key in inputs) {
	        		var input = $('<input/>', {
	        			'type'	: 'hidden',
	        			'name'	: key,
	        			'value'	: inputs[key]
	        		});
	        		form.append(input);
	        	}

	        	// Put the form in the body and submit
	        	$('body').append(form);
	        	form.submit();

	        	return false;
        	});
        }
    };
}());

DwollaBtn.init();