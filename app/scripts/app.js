define(['hammer', 'jqueryhammer', 'cookie', 'util', 'modernizr'], function() {
    'use strict';
    var TipperView = Backbone.View.extend({
            version: 'v0.5',
            el: $('#tipper'),
            updating: false,
            inputScreen: $('.screen-input'),
            outputScreen: $('.screen-output'),
            notificationEl: $('#notification'),
            initialize: function() {
                var self = this,
                    tips = $('.dailpad .btn[data-role="tip"]'),
                    splits = $('.dailpad .btn[data-role="split"]');

                console.log('initilizing tipper');
                
                if (!Modernizr.localstorage) {
                    // TODO: if not support localStorage
                } else {
                    if (!localStorage.getItem('installed') || localStorage.getItem('installed') !== self.version) {
                        localStorage.setItem('splits', JSON.stringify(['1', '2', '3']));
                        localStorage.setItem('tips', JSON.stringify(['15', '18', '20']));
                        localStorage.setItem('current_tip', '1');
                        // localStorage.setItem('current_split', '0');
                        localStorage.setItem('installed', self.version);
                    } else {
                            var tips_data = JSON.parse(localStorage.getItem('tips')),
                                splits_data = JSON.parse(localStorage.getItem('splits')),
                                i = 0;
                        
                        for (; i < tips.length; i++) {
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
                
                // Update tip according to history
                tips.removeClass('btn-pink');
                $(tips[current_tip]).addClass('btn-pink');
                                
                // app events
                self.on('updateinput', self.onInputUpate);
                self.on('updateoutput', self.onOutputUpdate);
                self.on('updatesplit', self.onSplitUpdate);
                self.on('reset', self.onReset);
                
                // disable scroll for the whole app
                $('#tipper').on('touchmove', self.stopScrolling);
                $('#tipper').on('touchstart', self.stopScrolling);
                
                // gesture related events triggering
                $('.dailpad .btn[data-role="tip"]').hammer().on('touchstart', function(e) {self.tipButtonClicked(e);});
                $('.dailpad .btn[data-role="split"]').hammer().on('touchstart hold', function(e) {self.splitButtonClicked(e);});
                $('.dailpad .btn[data-role="updateconfirm"]').hammer().on('touchstart', function(e) {self.confirmButtonClicked(e);});
                $('.dailpad .btn[data-role="updatecancel"]').hammer().on('touchstart', function(e) {self.cancelButtonClicked(e);});
                $('.dailpad .btn[data-role="num"]').hammer().on('touchstart', function(e) {self.numButtonClicked(e);});
                $('.dailpad .btn[data-role="pt"]').hammer().on('touchstart', function(e) {self.ptButtonClicked(e);});
                $('.dailpad .btn[data-role="clear"]').hammer().on('touchstart', function(e) {self.clearButtonClicked(e);});
                
                var appCache = window.applicationCache;
                
                appCache.addEventListener('downloading', function(e) {self.onCacheEvent(e);});
                appCache.addEventListener('progress', function(e) {self.onCacheEvent(e);});
                appCache.addEventListener('updateready', function(e) {self.onCacheEvent(e);});
                appCache.addEventListener('error', function(e) {self.onCacheEvent(e);});
            },
        
            onCacheEvent: function(e) {
                if (!this.notificationEl.hasClass('active')) {
                    this.notificationEl.addClass('active');
                }
                
                switch(e.type) {
                    case 'downloading':
                        this.notificationEl.text('New Update Available');
                        break;
                    case 'progress':
                        var progress = Math.round(e.loaded / e.total * 100).toString();
                        this.notificationEl.text('Updating on progress: ' + progress + '%');
                        break;
                    case 'updateready':
                        this.notificationEl.text('Complete! Restart Tipper and enjoy :)');
                        break;
                    default:
                        break;
                }
            },
        
            onCacheError: function(e) {
                console.log(e, 'error');
            },

            stopScrolling: function(e) {
                e.preventDefault();
            },
        
            changeSplit: function(change) {
                if (!this.updating)
                    return;
                
                var updateInputs = $('.dailpad .btn[data-update="input"]'),
                    updateHide = $('.dailpad .btn[data-update="hide"]'),
                    updateConfirm = $('.dailpad .btn[data-update="confirm"]'),
                    updateTargets = $('.dailpad .btn[data-update="target"]'),
                    updateCancel = $('.dailpad .btn[data-update="cancel"]');
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
                    if (!util.isNumber(data) || !change) {
                        data = JSON.parse(localStorage.getItem('splits'))[i];
                        me[0].firstChild.data = data;
                    } else {

                        // Check if the current updating value is duplicated among the other two
                        for (var j = 0; j < updateTargets.length; j++) {
                            if (j !== i && $(updateTargets[j])[0].firstChild.data == data) {
                                break;
                            }
                        }
                        
                        // if duplication exists, flash the other button
                        if (j !== updateTargets.length) {
                            $(updateTargets[j]).addClass('btn-blue');
                            setTimeout(function() { $(updateTargets[j]).removeClass('btn-blue'); }, 300);
                            return;
                        }

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
                    updateCancel.hide();
                }
                this.trigger('updateoutput');                
            },

            confirmButtonClicked: function(e) {
                if (!this.updating) {
                    return;
                }
                this.changeSplit(true);
            },
            
            cancelButtonClicked: function(e) {
                if (!this.updating) {
                    return;
                }
                this.changeSplit(false);
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
                $('.dailpad div[data-role="num"]').addClass('.btn-blue');
            },
        
            splitButtonClicked: function(e) {
                var me = $(e.target);
                if (e.type === 'hold' && !this.updating) {  
                    var updateInputs = $('.dailpad .btn[data-update="input"]'),
                        updateHide = $('.dailpad .btn[data-update="hide"]'),
                        updateConfirm = $('.dailpad .btn[data-update="confirm"]'),
                        updateCancel = $('.dailpad .btn[data-update="cancel"]'),
                        splitButtons = $('.dailpad .btn[data-role="split"]');

                    // If the updating one is not current highlighting, highlight current one
                    if (!me.hasClass('btn-blue')) {
                        splitButtons.removeClass('btn-blue');
                        me.addClass('btn-blue');
                    }
                    
                    console.log(updateCancel);
                    // UI Change for updating                    
                    me.addClass('updating');
                    updateInputs.addClass('updating');
                    updateHide.hide();
                    updateConfirm.show();
                    updateCancel.show();
                    me[0].firstChild.data = '_';

                    // Update status
                    this.updating = true;
                    
                } else if (e.type === 'touchstart') {
                    if (this.updating) {
                        this.changeSplit(true);
                        return;
                    }
                    var splitButtons = $('.dailpad .btn[data-role="split"]');
                    splitButtons.removeClass('btn-blue');
                    me.addClass('btn-blue');
                    this.trigger('updateoutput');
                }
            },

            updateInput: function(value) {
                if (!util.isNumber(value)) return;

                this.inputScreen.text(value);
                this.trigger('updateoutput', value);
            },

            updateOutput: function(value) {
                if (!util.isNumber(value)) return;
                this.outputScreen.text(value);
            },

            onInputUpate: function(value) {
                var currentInput = this.inputScreen.text(),
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
                    currentInput = parseFloat(this.inputScreen.text()),
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
                // if this's a double digit number not, submit changes
                if (target[0].firstChild.data.length > 1) {
                    this.changeSplit(true);
                }
            }

        
        });  

        return TipperView;
});