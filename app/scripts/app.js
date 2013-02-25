define(['jquery', 'underscore', 'backbone'], function() {
	var TipperView = Backbone.View.extend({
	    	DISPLAY_MAX_LENGTH: 7,
	    	el: $('#tipper'),
	        events: {
	        	'click .dailpad .btn[data-role="fn"]': 'fnButtonClicked',
	        	'click .dailpad .btn[data-role="num"]': 'numButtonClicked',
	        	'click .dailpad .btn[data-role="pt"]': 'ptButtonClicked',
	        	'click .dailpad .btn[data-role="clear"]': 'clearButtonClicked',
                'click .dailpad .btn[data-role="split"]': 'splitButtonClicked'
	        },

	        initialize: function() {
	        	this.on('changeinput', this.onInputChange);
	        	this.on('changeoutput', this.onOutputChange);
	        },

	        ptButtonClicked: function(e) {
	        	var currentInput = $('.display[data-role="input"] p').text();

	        	if (currentInput.indexOf('.') !== -1) {
	        		return;
	        	}

	        	this.updateInput(currentInput + '.');
	        },

	        clearButtonClicked: function(e) {
	        	this.updateInput('0');
	        },

	        fnButtonClicked: function(e) {
	        	var me = $(e.target),
	        		percentage = me.attr('data-percentage');

	        	$('.dailpad div.btn-red').removeClass('btn-red');
	        	me.addClass('btn-red');
	        	this.trigger('changeoutput');

	        },

	        numButtonClicked: function(e) {
	        	var me = $(e.target),
	        		num = me.attr('data-num'),
	        		currentInput = $('.display[data-role="input"] p').text(),
	        		pointIndex = currentInput.indexOf('.');
	        	
	        	if (pointIndex != -1 && (pointIndex > 5 || currentInput.length - pointIndex > 2)) {
	        		return;
	        	} else {
	        		if (pointIndex === -1 && currentInput.length > 4) {
	        			return;
	        		}

	        		if (currentInput === '0') {
	        			if (num === '0') {
	        				return;
	        			} else {
	        				currentInput = num;
	        			}
	        		} else {
	        			currentInput = currentInput + num;
	        		}
	        	}

	        	this.updateInput(currentInput);

	        	function isInt(n) {
	        		return n.valueOf() % 1 == 0 ? true: false;
	        	}
	        },
        
            splitButtonClicked: function(e) {
                var me = $(e.target),
                    num = me.attr('data-splits');
                    currentOutput = $('.display[data-role="output"] p').text();
                
                $('.dailpad div.btn-blue').removeClass('btn-blue');
                me.addClass('btn-blue');
                this.trigger('changeoutput');
            },

	        updateInput: function(value) {
	        	if (!isNumber(value)) return;

	        	$('.display[data-role="input"] p').text(value);
	        	this.trigger('changeinput', value);

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

	        onInputChange: function(value) {
	        	value = parseFloat(value);

	        	var percentage = parseInt($('.dailpad .btn-red[data-role="fn"]').attr('data-percentage'), 10) / 100,
	        	// console.log(value, percentage, parseInt(percentage) / 100);
	        		valueNew = (value + value * percentage).toFixed(2);

	        	if (valueNew == '0.00') valueNew = '0';

	        	this.updateOutput(valueNew);
	        },

	        onOutputChange: function() {
	        	var percentage = parseInt($('.dailpad .btn-red[data-role="fn"]').attr('data-percentage'), 10) / 100,
	        	    splits = parseInt($('.dailpad .btn-blue[data-role="split"]').attr('data-splits'), 10),
                    currentInput = parseFloat($('.display[data-role="input"] p').text()),
	        	   	valueNew = ((currentInput + currentInput * percentage) / splits).toFixed(2);

	        	if (valueNew === '0.00') valueNew = '0';
	        	this.updateOutput(valueNew);
	        }
	  	
	    });  

	  	return TipperView;
});