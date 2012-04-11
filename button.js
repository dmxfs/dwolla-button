var DwollaBtn = DwollaBtn || (function(){
    var _args = {
    	cssURI: 'button.css',
    	dwollaPayAction: 'https://www.dwolla.com/payment/pay'
    };

    return {
        init : function() {
        	// Append CSS
        	this.appendCSS();

        	// Bind buttons
        	this.registerButtons();
        	this.styleButtons();
        },
        appendCSS: function() {
        	var cssFile = $('<link/>', {
        		'rel': 'stylesheet',
        		'type': 'text/css',
        		'href': _args.cssURI
        	});

        	$('head').append(cssFile);
        },
        styleButtons: function() {
        	$('.dwolla_button').each(function() {
        		var el = $(this),
	        		styledBtn = el.clone(),
        			amount = el.attr('data-amount');

        		var btnText = $('<span/>', { 'class': 'd-btn-text', 'html': el.html()}),
        			btnSlideText = $('<span/>', { 'class': 'd-btn-slide-text', 'html': '$' + amount}),
        			btnIcon = $('<span/>', { 'class': 'd-btn-icon-right', 'html': '<span></span>'});

        		styledBtn
        			.empty()
        			.append(btnText)
        			.append(btnSlideText)
        			.append(btnIcon)
        			.addClass('d-btn')
        			.unbind('mouseover mouseout')
        			.bind({
        				mouseover: function() {
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

        		el.replaceWith(styledBtn);
        	})
        },
        registerButtons: function() {
        	$('.dwolla_button')
        	.unbind('click.DwollaBtn')
        	.live('click.DwollaBtn', function(e) {
        		e.preventDefault();

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

	        	$('body').append(form);
	        	form.submit();

	        	return false;
        	});
        }
    };
}());

DwollaBtn.init();