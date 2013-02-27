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
                        // localStorage.setItem('current_split', '0');
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
                var current_tip = parseInt(localStorage.getItem('current_tip')),
                    current_split = parseInt(localStorage.getItem('current_split'));

                tips.removeClass('btn-pink');
                $(tips[current_tip]).addClass('btn-pink');

                self.hideAddressBar();

                self.on('updateinput', self.onInputUpate);
                self.on('updateoutput', self.onOutputUpdate);
                self.on('updatesplit', self.onSplitUpdate);
                self.on('reset', self.onReset);

                $('#tipper').on('touchmove', this.stopScrolling);
                $('#tipper').on('touchstart', this.stopScrolling);

                $('.dailpad .btn[data-role="tip"]').hammer().on('tap', function(e) {self.tipButtonClicked(e);});
                $('.dailpad .btn[data-role="split"]').hammer().on('tap hold', function(e) {self.splitButtonClicked(e);});
                $('.dailpad .btn[data-role="updateconfirm"]').hammer().on('tap', function(e) {self.confirmButtonClicked(e);});
                $('.dailpad .btn[data-role="num"]').hammer().on('tap', function(e) {self.numButtonClicked(e);});
                $('.dailpad .btn[data-role="pt"]').hammer().on('tap', function(e) {self.ptButtonClicked(e);});
                $('.dailpad .btn[data-role="clear"]').hammer().on('tap', function(e) {self.clearButtonClicked(e);});
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

            confirmButtonClicked: function(e) {
                if (!this.updating) {
                    return;
                }

                var updateInputs = $('.dailpad .btn[data-update="input"]'),
                    updateHide = $('.dailpad .btn[data-update="hide"]'),
                    updateConfirm = $('.dailpad .btn[data-update="confirm"]'),
                    updateTargets = $('.dailpad .btn[data-update="target"]'),
                    me = $('.dailpad .btn[data-update="target"].updating'),
                    splits = $('.dailpad .btn[data-role="split"]'),
                    i = 0;

                    // find the index of current me
                    for (; i < updateTargets.length; i++) {
                        if (updateTargets[i] === me[0]) {
                            break;
                        }
                    }

                if (me.hasClass('updating')) {
                    var data = me[0].firstChild.data;
                    if (!util.isNumber(data)) {
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
                    updateInputs.removeClass('updating');
                    updateHide.show();
                    updateConfirm.hide();
                }

                this.trigger('updateoutput');                
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
                }
                
                $('.dailpad div.btn-pink').removeClass('btn-pink');
                me.addClass('btn-pink');

                this.trigger('updateoutput');
            },

            numButtonClicked: function(e) {
                var me = $(e.target),
                    num = me.attr('data-num');

                if (me.hasClass('updating')) {
                    this.trigger('updatesplit', num);
                } else if (me.hasClass('btn-pink')) {

                } else {
                    this.trigger('updateinput', num);
                }
            },

            updateSplitOption: function(e) {
                console.log('e');
                $('.dailpad div[data-role="num"]').addClass('.btn-blue');
            },
        
            splitButtonClicked: function(e) {
                var me = $(e.target);
                if (e.type === 'hold' && !this.updating) {  
                    var updateInputs = $('.dailpad .btn[data-update="input"]'),
                        updateHide = $('.dailpad .btn[data-update="hide"]'),
                        updateConfirm = $('.dailpad .btn[data-update="confirm"]'),
                        splitButtons = $('.dailpad .btn[data-role="split"]');

                    // If the updating one is not current highlighting, highlight current one
                    if (!me.hasClass('btn-blue')) {
                        splitButtons.removeClass('btn-blue');
                        me.addClass('btn-blue');
                    }

                    // UI Change for updating                    
                    me.addClass('updating');
                    updateInputs.addClass('updating');
                    updateHide.hide();
                    updateConfirm.show();
                    me[0].firstChild.data = '_';
                    // Update status
                    this.updating = true;
                    
                } else if (e.type === 'tap') {
                    var num = me.attr('data-splits');
                        currentOutput = $('.display[data-role="output"] p').text(),
                        splitButtons = $('.dailpad .btn[data-role="split"]'),
                        splits = $('.dailpad .btn[data-role="split"]'),
                        i = 0;

                    // find the index of current me
                    for (; i < splits.length; i++) {
                        if (splits[i] === me[0]) {
                            break;
                        }
                    }

                    if (this.updating) {
                        var updateInputs = $('.dailpad .btn[data-update="input"]'),
                            updateHide = $('.dailpad .btn[data-update="hide"]'),
                            updateConfirm = $('.dailpad .btn[data-update="confirm"]');

                        if (me.hasClass('updating')) {
                            var data = me[0].firstChild.data;
                            if (!util.isNumber(data)) {
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
                            updateInputs.removeClass('updating');
                            updateHide.show();
                            updateConfirm.hide();
                        }
                    }
    
                    splitButtons.removeClass('btn-blue');
                    me.addClass('btn-blue');
    
                    this.trigger('updateoutput');
                }
            },

            updateInput: function(value) {
                if (!util.isNumber(value)) return;

                $('.display[data-role="input"] p').text(value);
                this.trigger('updateoutput', value);
            },

            updateOutput: function(value) {
                if (!util.isNumber(value)) return;
                $('.display[data-role="output"] p').text(value);
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
                    if (!util.isInt(value)) {
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
            },

            onOutputUpdate: function() {
                var percentage = parseInt($('.dailpad .btn-pink[data-role="tip"]').attr('data-percentage'), 10) / 100,
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
                var target = $('.dailpad .btn[data-role="split"].updating'),
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