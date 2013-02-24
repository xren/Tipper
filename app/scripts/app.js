// define(['vendor/jquery.min.js'], function() {
//  return 'Hello from Yeoman!';
// });

$(function() {
    
    var TipperView = Backbone.View.extend({
    	DISPLAY_MAX_LENGTH: 7,
    	el: $('#tipper'),
        events: {
        	'touchstart .dailpad .btn[data-role="fn"]': 'fnButtonClicked',
        	'touchstart .dailpad .btn[data-role="num"]': 'numButtonClicked',
        	'touchstart .dailpad .btn[data-role="pt"]': 'ptButtonClicked',
        	'touchstart .dailpad .btn[data-role="clear"]': 'clearButtonClicked'
        },
        initialize: function() {
        	this.on('changedinput', this.onInputChanged);
        	this.on('changedpercentage', this.onPercentageChanged);
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
        	this.trigger('changedpercentage');

        },

        numButtonClicked: function(e) {
        	var me = $(e.target),
        		num = me.attr('data-num'),
        		currentInput = $('.display[data-role="input"] p').text();
        	
        	if (currentInput.length > this.DISPLAY_MAX_LENGTH) {
        		return;

        	} else if (currentInput === '0') {
        		if (num === '0') {
        			return;
        		} else {
        			currentInput = num;
        		}
        	} else {
        		currentInput = currentInput + num;
        	}

        	this.updateInput(currentInput);

        	function isInt(n) {
        		return n.valueOf() % 1 == 0 ? true: false;
        	}

        },

        updateInput: function(value) {
        	if (!isNumber(value)) return;

        	$('.display[data-role="input"] p').text(value);
        	this.trigger('changedinput', value);

        	function isNumber(n) {
        		return true;
        	}
        },

        updateOutput: function(value) {
        	if (!isNumber(value)) return;
        	$('.display[data-role="output"] p').text(value);
        	
        	function isNumber(n) {
        		return true;
        	}

        },

        onInputChanged: function(value) {
        	value = parseFloat(value);

        	var percentage = parseInt($('.dailpad .btn-red[data-role="fn"]').attr('data-percentage')) / 100,
        	// console.log(value, percentage, parseInt(percentage) / 100);
        		valueNew = (value + value * percentage).toFixed(2);

        	if (valueNew == '0.00') valueNew = '0';

        	this.updateOutput(valueNew);
        },

        onPercentageChanged: function() {
        	var percentage = parseInt($('.dailpad .btn-red[data-role="fn"]').attr('data-percentage')) / 100,
        	    currentInput = parseFloat($('.display[data-role="input"] p').text());

        	this.updateOutput((currentInput + currentInput * percentage).toFixed(2));
        }
  	
    });  

  	var view = new TipperView;
});
