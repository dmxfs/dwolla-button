var DwollaBtn = DwollaBtn || (function(){
    var _args = {};

    return {
        init : function() {
        	this.registerButtons();
        	this.styleButtons();
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
        				'action': 'https://www.dwolla.com/payment/pay'
	        		});

	        	// Create and append inputs
	        	var time = Math.floor((new Date).getTime() / 1000),
	        		inputs = {
		        		destinationId: el.attr('data-dest'),
		        		amount: el.attr('data-amount'),
		        		shipping: el.attr('data-shipping'),
		        		tax: el.attr('data-tax'),
		        		name: el.attr('data-name'),
		        		desc: el.attr('data-desc'),
		        		redirect: el.attr('href'),
		        		key: el.attr('key')
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