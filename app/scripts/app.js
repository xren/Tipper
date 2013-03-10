define(['hammer', 'jqueryhammer', 'cookie', 'util', 'modernizr'], function() {
    'use strict';
    var TipperView = Backbone.View.extend({
            version: 'v0.5',
            el: $('#tipper'),
            updating: false,
            inputScreenEl: $('.input-value'),
            outputScreenEl: $('.output-value'),
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
//                            $(splits[i]).attr('data-splits', split);
//                            splits[i].firstChild.data = split;
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
                $('.dailpad .btn[data-role="split"]').hammer().on('touchstart', function(e) {self.splitButtonClicked(e);});
                $('.dailpad .btn[data-role="updateconfirm"]').hammer().on('touchstart', function(e) {self.confirmButtonClicked(e);});
                $('.dailpad .btn[data-role="updatecancel"]').hammer().on('touchstart', function(e) {self.cancelButtonClicked(e);});
                $('.dailpad .btn[data-role="num"]').hammer().on('touchstart', function(e) {self.numButtonClicked(e);});
                $('.dailpad .btn[data-role="pt"]').hammer().on('touchstart', function(e) {self.ptButtonClicked(e);});
                $('.dailpad .btn[data-role="clear"]').hammer().on('touchstart', function(e) {self.clearButtonClicked(e);});
                $('.dailpad .btn[data-role="total"]').hammer().on('touchstart', function(e) {self.totalButtonClicked(e);});

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
                        var action = window.navigator.standalone ? 'Restart' : 'Refresh',
                            notification = 'Complete! ' + action + ' Tipper and enjoy :)';
                        
                        this.notificationEl.text(notification);
                        break;
                    default:
                        if (this.notificationEl.hasClass('active')) {
                            this.notificationEl.removeClass('active');
                        }
                        break;
                }
            },
        
            onCacheError: function(e) {
                this.notificationEl.text('Update failed! Please restart Tipper.');
                console.log(e, 'error');
            },

            stopScrolling: function(e) {
                e.preventDefault();
            },
        
            changeSplit: function(change) {
                if (!this.updating)
                    return;
                
                var updateInputsEl = $('.dailpad .btn[data-update="input"]'),
                    updateHideEl = $('.dailpad .btn[data-update="hide"]'),
                    updateConfirmEl = $('.dailpad .btn[data-update="confirm"]'),
                    updateTargetsEl = $('.dailpad .btn[data-update="target"]'),
                    updateCancelEl = $('.dailpad .btn[data-update="cancel"]'),
                    currentEl = $('.dailpad .btn[data-update="target"].updating'),
                    splits = $('.dailpad .btn[data-role="split"]'),
                    i = 0;

                if (change) {
                    
                } else {
                }
                
                
                // find the index of current me
                for (; i < updateTargetsEl.length; i++) {
                    if (updateTargetsEl[i] === currentEl[0]) {
                        break;
                    }
                }
                
                
                if (currentEl.hasClass('updating')) {
                    var data = currentEl[0].firstChild.data;
                    if (!util.isNumber(data) || !change) {
                        data = JSON.parse(localStorage.getItem('splits'))[i];
                        currentEl[0].firstChild.data = data;
                    } else {

                        // Check if the current updating value is duplicated among the other two
                        for (var j = 0; j < updateTargetsEl.length; j++) {
                            if (j !== i && $(updateTargetsEl[j])[0].firstChild.data == data) {
                                break;
                            }
                        }
                        
                        // if duplication exists, flash the other button
                        if (j !== updateTargetsEl.length) {
                            $(updateTargetsEl[j]).addClass('btn-blue');
                            setTimeout(function() { $(updateTargetsEl[j]).removeClass('btn-blue'); }, 300);
                            return;
                        }

                        currentEl.attr('data-splits', data);                        
                    }

                    this.updating = false;
                    currentEl.removeClass('updating');
                    updateInputsEl.removeClass('updating');
                    updateHideEl.show();
                    updateConfirmEl.hide();
                    updateCancelEl.hide();
                }
                this.trigger('updateoutput');                
            },

            confirmButtonClicked: function(e) {
                if (!this.updating) {
                    return;
                }
                
                var currentEl = $(e.target),
                    updatingEl = $('.updating'),
                    updateHideEl = $('.dailpad .btn[data-update="hide"]'),
                    buttonInputEl = $('.btn[data-role="split"] .input-btn'),
                    totalLabelEl = $('.info-total'),
                    eachLabelEl = $('.info-each');
                
                if (buttonInputEl.text() === '_') {
                    return;
                }
                
                updatingEl.removeClass('updating');
                updateHideEl.show();
                currentEl.hide();
                if (totalLabelEl.hasClass('active')) {
                    totalLabelEl.removeClass('active');
                    eachLabelEl.addClass('active');
                }
                this.updating = false;
                this.trigger('updateoutput');
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

            totalButtonClicked: function(e) {
                var currentEl = $(e.target),
                    updateInputsEl = $('.dailpad .btn[data-update="input"]'),
                    updateHideEl = $('.dailpad .btn[data-update="hide"]'),
                    updateConfirmEl = $('.dailpad .btn[data-update="confirm"]'),
                    splitButtonEl = $('.dailpad .btn[data-role="split"]'),
                    totalButtonEl = $('.dailpad .btn[data-role="total"]'),
                    buttonInputFieldEl = $('.input-btn'),
                    splitButtonsIconEl = $('.btn[data-role="split"] .icon' ),
                    totalLabelEl = $('.info-total'),
                    eachLabelEl = $('.info-each');

                if (e.type === 'touchstart') {
                    if (!currentEl.hasClass('btn-blue')) {
                        this.updating = false;
                        buttonInputFieldEl.text('_');
                        buttonInputFieldEl.removeClass('active');
                        $(splitButtonsIconEl[0]).show();
                        updateHideEl.show();
                        updateConfirmEl.hide();

                        splitButtonEl.removeClass('btn-blue');
                        currentEl.addClass('btn-blue');
                        $('.updating').removeClass('updating');
        
                        if (eachLabelEl.hasClass('active')) {
                            eachLabelEl.removeClass('active');
                            totalLabelEl.addClass('active');
                        }

                        this.trigger('updateoutput');
                    }
                }
            },
        
            splitButtonClicked: function(e) {
                var currentEl = $(e.target),
                    updateInputEl = $('.dailpad .btn[data-update="input"]'),
                    updateHideEl = $('.dailpad .btn[data-update="hide"]'),
                    updateConfirmEl = $('.dailpad .btn[data-update="confirm"]'),
                    splitButtonEl = $('.dailpad .btn[data-role="split"]'),
                    totalButtonEl = $('.dailpad .btn[data-role="total"]'),
                    buttonInputEl = $('.input-btn'),
                    splitButtonsIconEl = $('.btn[data-role="split"] .icon'),
                    totalLabelEl = $('.info-total'),
                    eachLabelEl = $('.info-each');

                if (e.type === 'touchstart') {
                    if (this.updating) {
                        if (buttonInputEl.text() === '_') {
                            return;
                        }
                        $('.updating').removeClass('updating');
                        updateHideEl.show();
                        updateConfirmEl.hide();
                        this.updating = false;

                        if (totalLabelEl.hasClass('active')) {
                            totalLabelEl.removeClass('active');
                            eachLabelEl.addClass('active');
                        }

                        this.trigger('updateoutput');
                    } else {  
                        if (!buttonInputEl.hasClass('active')) {
                            buttonInputEl.addClass('active');
                            $(splitButtonsIconEl[0]).hide();
                        }

                        buttonInputEl.text('_');  
                        // If the updating one is not current highlighting, highlight current one
                        if (!currentEl.hasClass('btn-blue')) {
                            totalButtonEl.removeClass('btn-blue');
                            currentEl.addClass('btn-blue');
                        }
                        
                        if (!currentEl.hasClass('updating')) {
                            currentEl.addClass('updating');
                        }

                        if (!updateInputEl.hasClass('updating')) {
                            updateInputEl.addClass('updating');
                        }
                        // UI Change for updating                    
                        updateHideEl.hide();
                        updateConfirmEl.show();
                        
                        // Update status
                        this.updating = true;
                    }
                }
            },

            updateInput: function(value) {
                if (!util.isNumber(value)) return;

                this.inputScreenEl.text(value);
                this.trigger('updateoutput', value);
            },

            updateOutput: function(value) {
                if (!util.isNumber(value)) return;
                this.outputScreenEl.text(value);
            },

            onInputUpate: function(value) {
                var currentInput = this.inputScreenEl.text(),
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
                    splits = parseInt($('.btn[data-role="split"] .input-btn').text(), 10),
                    currentInput = parseFloat(this.inputScreenEl.text()),
                    totalLabelEl = $('.info-total'),
                    eachLabelEl = $('.info-each'),
                    valueNew;

                // If current on total
                if (!$('.btn[data-role="split"]').hasClass('btn-blue')) {
                    splits = 1;
                }

                valueNew = ((currentInput + currentInput * percentage) / splits).toFixed(2);

                if (valueNew === '0.00') valueNew = '0';

                this.updateOutput(valueNew);
            },

            onReset: function() {
                if (this.updating) {
                    var ButtonInputEl = $('.btn[data-role="split"] .input-btn');
                    ButtonInputEl.text('_');
                } else {
                    this.updateInput('0');
                }
            },

            onSplitUpdate: function(num) {
                var buttonInputEl = $('.btn[data-role="split"] .input-btn'),
                    text = buttonInputEl.text();

                if (text.length > 1) {
                    return;
                }

                if (text === '_') {
                    if (num == 0) return;
                    text = num;
                } else {
                    text += num;
                }
                
                buttonInputEl.text(text);
                // target[0].firstChild.data = text;
                // // if this's a double digit number not, submit changes
                // if (target[0].firstChild.data.length > 1) {
                //     this.changeSplit(true);
                // }
            }

        
        });  

        return TipperView;
});