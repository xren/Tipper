define(['underscore', 'backbone'], function() {
	var TipperView = Backbone.View.extend({
	    	el: $('#tipper'),
	        events: {
	        	'touchstart .dailpad .btn[data-role="fn"]': 'fnButtonClicked',
	        	'touchstart .dailpad .btn[data-role="num"]': 'numButtonClicked',
	        	'touchstart .dailpad .btn[data-role="pt"]': 'ptButtonClicked',
	        	'touchstart .dailpad .btn[data-role="clear"]': 'clearButtonClicked',
                'touchstart .dailpad .btn[data-role="split"]': 'splitButtonClicked'
	        },

	        initialize: function() {
	        	console.log('initilizing tipper');
	        	this.hideAddressBar();
	        	this.on('updateinput', this.onInputUpate);
	        	this.on('updateoutput', this.onOutputUpdate);
	        	this.on('reset', this.onReset);
	        	$('#tipper').on('touchmove', this.stopScrolling);
	        	$('#tipper').on('touchstart', this.stopScrolling);
	        },

	        hideAddressBar: function() {
				if (document.height <= window.outerHeight + 10) {
				document.body.style.height = (window.outerHeight + 60) + 'px';
				setTimeout(function() {window.scrollTo(0, 1);}, 50);
				} else {
				setTimeout(function() {window.scrollTo(0, 1);}, 0);
				}
    		},

	        stopScrolling: function(e) {
	        	e.preventDefault();
	        },

	        ptButtonClicked: function(e) {
	        	this.trigger('updateinput', '.');
	        },

	        clearButtonClicked: function(e) {
	        	this.trigger('reset');
	        },

	        fnButtonClicked: function(e) {
	        	var me = $(e.target),
	        		percentage = me.attr('data-percentage');

	        	$('.dailpad div.btn-red').removeClass('btn-red');
	        	me.addClass('btn-red');

	        	this.trigger('updateoutput');
	        },

	        numButtonClicked: function(e) {
	        	var me = $(e.target),
	        		num = me.attr('data-num');

	        	this.trigger('updateinput', num);
	        },
        
            splitButtonClicked: function(e) {
                var me = $(e.target),
                    num = me.attr('data-splits');
                    currentOutput = $('.display[data-role="output"] p').text();
                
                $('.dailpad div.btn-blue').removeClass('btn-blue');
                me.addClass('btn-blue');

                this.trigger('updateoutput');
            },

	        updateInput: function(value) {
	        	if (!isNumber(value)) return;

	        	$('.display[data-role="input"] p').text(value);
	        	this.trigger('updateoutput', value);

	        	function isNumber(n) {
	        		return !isNaN(parseFloat(n)) && isFinite(n);
	        	}
	        },

	        updateOutput: function(value) {
	        	if (!isNumber(value)) return;
	        	$('.display[data-role="output"] p').text(value);
	        	
	        	function isNumber(n) {
	        		return !isNaN(parseFloat(n)) && isFinite(n);
	        	}
	        },

	        onInputUpate: function(value) {
	        	var	currentInput = $('.display[data-role="input"] p').text(),
	        		pointIndex = currentInput.indexOf('.');

	        	if (value === '.') {
		        	if (pointIndex !== -1) {
		        		return;
		        	}
		        	currentInput = currentInput + value;
	        	} else {
	        		if (!isInt(value)) {
	        			return;
	        		}

					if (pointIndex != -1 && (pointIndex > 5 || currentInput.length - pointIndex > 2)) {
						return;
					} else {
						if (pointIndex === -1 && currentInput.length > 4) {
							return;
						}

						if (currentInput === '0') {
							if (value === '0') {
								return;
							} else {
								currentInput = value;
							}
						} else {
							currentInput = currentInput + value;
						}
					}
	        	}
	        	
	        	this.updateInput(currentInput);

	        	function isInt(n) {
	        		return n.valueOf() % 1 == 0 ? true: false;
	        	}

	        },

	        onOutputUpdate: function() {
	        	var percentage = parseInt($('.dailpad .btn-red[data-role="fn"]').attr('data-percentage'), 10) / 100,
	        	    splits = parseInt($('.dailpad .btn-blue[data-role="split"]').attr('data-splits'), 10),
                    currentInput = parseFloat($('.display[data-role="input"] p').text()),
	        	   	valueNew = ((currentInput + currentInput * percentage) / splits).toFixed(2);

	        	if (valueNew === '0.00') valueNew = '0';

	        	this.updateOutput(valueNew);
	        },

	        onReset: function() {
	        	this.updateInput('0');
	        }

	  	
	    });  

	  	return TipperView;
});