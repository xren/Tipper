define(['hammer', 'cookie', 'util', 'modernizr'], function() {
    var TipperView = Backbone.View.extend({
            version: 'v0.5',
            el: $('#tipper'),
            updating: false,
            initialize: function() {
                var self = this,
                    tips = $('.dailpad .btn[data-role="tip"]'),
                    splits = $('.dailpad .btn[data-role="split"]');

                console.log('initilizing tipper');
                
                if (!Modernizr.localstorage) {

                } else {
                    if (!localStorage.getItem('installed') || localStorage.getItem('installed') !== self.version) {
                        localStorage.setItem('splits', JSON.stringify(['1', '2', '3']));
                        localStorage.setItem('tips', JSON.stringify(['15', '18', '20']));
                        localStorage.setItem('current_tip', '1');
                        localStorage.setItem('current_split', '0');
                        localStorage.setItem('installed', self.version);
                    } else {
                            tips_data = JSON.parse(localStorage.getItem('tips')),
                            splits_data = JSON.parse(localStorage.getItem('splits'));
                        
                        for (var i = 0; i < tips.length; i++) {
                            var tip = tips_data[i],
                                split = splits_data[i];

                            $(tips[i]).attr('data-percentage', tip);
                            $(tips[i]).text(tip + '%');
                            $(splits[i]).attr('data-splits', split);
                            splits[i].firstChild.data = split;
                        }
                    }
                }

                // Initilize options
                current_tip = parseInt(localStorage.getItem('current_tip')),
                current_split = parseInt(localStorage.getItem('current_split')),

                tips.removeClass('btn-red');
                $(tips[current_tip]).addClass('btn-red');
                
                splits.removeClass('btn-blue');
                $(splits[current_split]).addClass('btn-blue');


                self.hideAddressBar();

                self.on('updateinput', self.onInputUpate);
                self.on('updateoutput', self.onOutputUpdate);
                self.on('updatesplit', self.onSplitUpdate);
                self.on('reset', self.onReset);

                $('#tipper').on('touchmove', this.stopScrolling);
                $('#tipper').on('touchstart', this.stopScrolling);

                $('.dailpad .btn[data-role="tip"]').hammer().on('touchstart', function(e) {self.tipButtonClicked(e);});
                $('.dailpad .btn[data-role="split"]').hammer().on('touchstart hold', function(e) {self.splitButtonClicked(e);});
                // $('.dailpad .btn[data-role="split"]').hammer().on('hold', function(e) {self.updateSplitOption(e);});
                $('.dailpad .btn[data-role="num"]').hammer().on('touchstart', function(e) {self.numButtonClicked(e);});
                $('.dailpad .btn[data-role="pt"]').hammer().on('touchstart', function(e) {self.ptButtonClicked(e);});
                $('.dailpad .btn[data-role="clear"]').hammer().on('touchstart', function(e) {self.clearButtonClicked(e);});
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
                console.log('e');
                this.trigger('reset');
            },

            tipButtonClicked: function(e) {
                var me = $(e.target),
                    percentage = me.attr('data-percentage'),
                    tips = $('.dailpad .btn[data-role="tip"]'),
                    i = 0;
                
                for (; i < tips.length; i++) {
                    if (tips[i] === me[0])
                        break;
                }
                
                if (Modernizr.localstorage) {
                    localStorage.setItem('current_tip', i.toString());
                    console.log(localStorage.getItem('current_tip'));
                }
                
                $('.dailpad div.btn-red').removeClass('btn-red');
                me.addClass('btn-red');

                this.trigger('updateoutput');
            },

            numButtonClicked: function(e) {
                var me = $(e.target),
                    num = me.attr('data-num');

                if (me.hasClass('btn-blue')) {
                    this.trigger('updatesplit', num);
                } else if (me.hasClass('btn-red')) {

                } else {
                    this.trigger('updateinput', num);
                }
            },

            updateSplitOption: function(e) {
                console.log('e');
                $('.dailpad div[data-role="num"]').addClass('.btn-blue');
            },
        
            splitButtonClicked: function(e) {
                var me = $(e.target),
                    numBtns = $('.dailpad div[data-role="num"]'),
                    clearBtn = $('.btn[data-role="clear"]');

                if (e.type === 'hold' && !this.updating) {  
                    $('.dailpad div.btn-blue').removeClass('btn-blue');
                    me.addClass('btn-blue');
                    me.addClass('updating');
                    numBtns.addClass('btn-blue');
                    clearBtn.addClass('btn-blue');
                    this.updating = true;
                    me[0].firstChild.data = '_';
                    
                } else if (e.type === 'touchstart') {
                    var num = me.attr('data-splits');
                        currentOutput = $('.display[data-role="output"] p').text(),
                        splits = $('.dailpad .btn[data-role="split"]'),
                        i = 0;

                    for (; i < splits.length; i++) {
                        if (splits[i] === me[0]) {
                            break;
                        }
                    }

                    if (this.updating) {
                        if (me.hasClass('updating')) {
                            var data = me[0].firstChild.data;
                            if (!isNumber(data)) {
                                data = JSON.parse(localStorage.getItem('splits'))[i];
                                me[0].firstChild.data = data;
                            } else {
                                me.attr('data-splits', data);
                                if (Modernizr.localstorage) {
                                    var split_data = JSON.parse(localStorage.getItem('splits'));
                                    split_data[i] = data;
                                    localStorage.setItem('splits', JSON.stringify(split_data));
                                }
                            }

                            this.updating = false;
                            me.removeClass('updating');
                            numBtns.removeClass('btn-blue');
                            clearBtn.removeClass('btn-blue');
                        }
                        return;
                    }

                    if (Modernizr.localstorage) {
                        localStorage.setItem('current_split', i.toString());
                    }
    
                    $('.dailpad div.btn-blue').removeClass('btn-blue');
                    me.addClass('btn-blue');
    
                    this.trigger('updateoutput');
                }

                function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }

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
                var currentInput = $('.display[data-role="input"] p').text(),
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
                var percentage = parseInt($('.dailpad .btn-red[data-role="tip"]').attr('data-percentage'), 10) / 100,
                    splits = parseInt($('.dailpad .btn-blue[data-role="split"]').attr('data-splits'), 10),
                    currentInput = parseFloat($('.display[data-role="input"] p').text()),
                    valueNew = ((currentInput + currentInput * percentage) / splits).toFixed(2);

                if (valueNew === '0.00') valueNew = '0';

                this.updateOutput(valueNew);
            },

            onReset: function() {
                if (this.updating) {
                    var updating_el = $('.btn.updating');
                    updating_el[0].firstChild.data = '_';
                } else {
                    this.updateInput('0');
                }
            },

            onSplitUpdate: function(num) {
                var target = $('.dailpad .btn-blue.updating'),
                    text = target[0].firstChild.data;

                if (text.length > 1) {
                    return;
                }

                if (text === '_') {
                    if (num == 0) return;
                    text = num;
                } else {
                    text += num;
                }
                target[0].firstChild.data = text;
            }

        
        });  

        return TipperView;
});