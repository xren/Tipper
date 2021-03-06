define(['hammer', 'jqueryhammer', 'cookie', 'util', 'modernizr'], function() {
    'use strict';
    var touchMethod = 'tap',
        errorMessage = {
            incorrectBill: 'Incorrect Bill',
            incorrectMode: 'Incorrect Mode',
            incorrectPercentage: 'Incorrect Percentage',
            incorrectSplits: 'Incorrect Splists',
            incorrectTotal: 'Incorrect Total',
            incorrectEditingStatus: 'Incorrect Editing Status',
            incorrectTipTotal: 'Incorrect Tip Total',
            billGreaterThanTotal: 'Incorrect Value. Bill greater than Total',
            nanError: 'NaN Error',
        };
    
    if (Modernizr.touch) {
        touchMethod = 'touchstart';
    }

    var SettingsView = Backbone.View.extend({
        initialize: function() {
            var self = this;

            this.$el.on('touchmove', self.stopScrolling);
            this.$el.on('touchstart', self.stopScrolling);
        },

        stopScrolling: function(e) {
            e.preventDefault();
        }
    });

    var App = Backbone.View.extend({
        initialize: function() {
            var self = this,
                appCache = window.applicationCache;
            
            appCache.addEventListener('downloading', function(e) {self.onCacheEvent(e);});
            appCache.addEventListener('progress', function(e) {self.onCacheEvent(e);});
            appCache.addEventListener('updateready', function(e) {self.onCacheEvent(e);});
            appCache.addEventListener('error', function(e) {self.onCacheEvent(e);});
            appCache.addEventListener('obsolete', function(e) {self.onCacheEvent(e);});

            self.notificationEl = self.$el.find('#notification');
            self.tipperEl = self.$el.find('#tipper');
            self.editingOverlayEl = self.$el.find('.editing-overlay');
            // self.settingsIconEl = self.$el.find('.icon-settings');

            self.tipperEl.on('touchmove', self.stopScrolling);
            self.tipperEl.on('touchstart', self.stopScrolling);
            self.editingOverlayEl.on('touchmove', self.stopScrolling);
            self.editingOverlayEl.on('touchstart', self.stopScrolling);

            self.tipperEl.hammer().on('dragleft', function(e) {self.doubletap(e);});

            // self.settingsIconEl.hammer().on(touchMethod, function(e) {self.settingsTapped(e);});
            
            self.listenTo(self.model, 'change:splitsEditing', self.changeSplitEditing);
            
            self.loadSettings(self.appVersion);
        },
        
        loadSettings: function(appVersion) {
            var settings = {
                    seenTutorial: 'false'
                },
                updateSettings = {
                    version: appVersion
                }
            
            if (Modernizr.localstorage) {
                var version = window.localStorage.getItem('version'),
                    item;
                if (!version) {
                    // New user, never used tipper before
                    // Give them all the setting items
                    for (item in settings) {
                        window.localStorage.setItem(item, settings[item]);
                    }
                    for (item in updateSettings) {
                        window.localStorage.setItem(item, updateSettings[item]);
                    }
                } else if (version !== this.appVersion) {
                    // Return user with version fall behind
                    for (item in updateSettings) {
                        window.localStorage.setItem(item, updateSettings[item]);
                    }
                } else {
                    // Return user with lastest vesrion, cool!
                    // Current do nothing
                    return;
                }
            } else {
                // Browser doesn't support localStorage, get it updated!!
                return;
            }
            
            // TODO: load actual settings
        },

        doubletap: function(e) {
            return;
        },
        
        settingsTapped: function(e) {
            if (this.tipperEl.hasClass('slideleft')) {
                this.tipperEl.removeClass('slideleft');
            } else {
                this.tipperEl.addClass('slideleft');
            }
        },

        stopScrolling: function(e) {
            e.preventDefault();
        },
        
        changeSplitEditing: function(e) {
            var editing = this.model.get('splitsEditing');
            
            if (editing) {
                if (Modernizr.localstorage) {
                    var seenTutorial = window.localStorage.getItem('seenTutorial');
                    if (seenTutorial === 'true') {
                        return;   
                    }                    
                    window.localStorage.setItem('seenTutorial', 'true');
                }
                this.editingOverlayEl.addClass('active');
            } else {
                this.editingOverlayEl.removeClass('active');
            }            
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
                    if (progress == '100') {
                        // refresh the app when app finish updating
                        // not using the updateready event because it sometimes not being fired correctly
                        var action = window.navigator.standalone ? 'restarting..' : 'Refresh..',
                            notification = 'Complete! Tipper is ' + action ;
                        var appCache = window.applicationCache;

                        this.notificationEl.text(notification);
                        window.location.href = window.location.href;
                    }
                    break;
                case 'obsolete':
                case 'error':
                    //Fixme: ifinite loop
                    var appCache = window.applicationCache;
                    // appCache.update();
                    if (this.notificationEl.hasClass('active')) {
                        this.notificationEl.removeClass('active');
                    }
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
    });
    
    
    var Model = Backbone.Model.extend({
        defaults : {
            bill: '0',
            total: '0',
            eachTotal: '0',
            eachTip: '0',
            tipTotal: '0',
            percentage: '18',
            splits: '1',
            displayMode: 'total',
            splitsEditing: false
        },

        changeEditing: function(isEditing) {
            if (isEditing !== true && isEditing !== false) {
                throw errorMessage.incorrectEditingStatus;
            }

            this._setAttr('splitsEditing', isEditing);
        },

        changeDisplayMode: function(mode) {
            if (mode !== 'total' && mode !== 'each') {
                throw errorMessage.incorrectMode;
            }
            // alert('ready to set mode');
            this._setAttr('displayMode', mode);
            this.trigger('change:displayMode');
        },

        changePercentage: function(percentage) {
            if (!util.isInt(percentage)) {
                throw errorMessage.incorrectPercentage;
            }

            this._setAttr('percentage', percentage.toString());
            this.updateAll();
            this.trigger('change:percentage');
        },

        changeSplits: function(splits) {
            if (!util.isInt(splits)) {
                throw errorMessage.incorrectSplits;
            }
            this._setAttr('splits', splits.toString());
            this.updateAll();
            this.trigger('change:splits');
        },

        changeBill: function(bill) {
            if (!util.isNumber(bill)) {
                throw errorMessage.incorrectBill;
            }

            this._setAttr('bill', bill.toString());
            this.updateAll();
            this.trigger('change:bill');
        },

        calcTotal: function(bill, percentage) {
            if (!util.isNumber(bill) || !util.isInt(percentage)) {
                throw errorMessage.nanError;
            }

            if (bill < 0) {
                throw errorMessage.incorrectBill;
            }

            if (percentage < 0) {
                throw errorMessage.incorrectPercentage;
            }

            return (bill * (1 + percentage / 100)).toFixed(2);
        },

        calcTipTotal: function(bill, total) {
            if (!util.isNumber(bill) || !util.isNumber(total)) {
                throw errorMessage.nanError;
            }

            if (bill < 0) {
                throw errorMessage.incorrectBill;
            }

            if (total < 0) {
                throw errorMessage.incorrectTotal;
            }

            if (bill > total) {
                throw errorMessage.billGreaterThanTotal;
            }

            return (total - bill).toFixed(2);
        },

        calcEachTotal: function(total, splits) {
            if (!util.isNumber(total) || !util.isInt(splits)) {
                throw errorMessage.nanError;
            }

            if (total < 0) {
                throw errorMessage.incorrectTotal;
            }

            if (splits < 1) {
                throw errorMessage.incorrectSplits;
            }

            var result = (total / splits).toFixed(2);

            return parseFloat(this.get('bill')) > 0 && result < 0.01? 0.01 : result;
        },

        calcEachTip: function(tipTotal, splits) {
            if (!util.isNumber(tipTotal) || !util.isInt(splits)) {
                throw errorMessage.nanError;
            }

            if (tipTotal < 0) {
                throw errorMessage.incorrectTipTotal;
            }

            if (splits < 1) {
                throw errorMessage.incorrectSplits;
            }
            
            return (tipTotal / splits).toFixed(2);
        },

        updateAll: function() {
            this._setAttr('total', this.calcTotal(parseFloat(this.get('bill')), parseInt(this.get('percentage'))));
            this._setAttr('tipTotal', this.calcTipTotal(parseFloat(this.get('bill')), parseFloat(this.get('total'))));
            this._setAttr('eachTotal', this.calcEachTotal(parseFloat(this.get('total')), parseInt(this.get('splits'))));
            this._setAttr('eachTip', this.calcEachTip(parseFloat(this.get('tipTotal')), parseInt(this.get('splits'))));
        },

        _setAttr: function(attr, value) {
            if (value === '0.00') {
                value = '0';
            }

            var dict = {};
            dict[attr] = value;

            this.set(dict);
        }

    });

    var InputScreen = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, 'change:bill', this.changeBill);
        },

        changeBill: function(e) {
            var inputValueEl = this.$el.find('.input-value');
            inputValueEl.text(this.model.get('bill'));
        }
    });

    var OutputScreen = Backbone.View.extend({
        initialize: function() {
            this.totalEl = this.$el.find('.info-total');
            this.eachEl = this.$el.find('.info-each');
            this.outputValueEl = this.$el.find('.output-value');

            this.listenTo(this.model, 'change:displayMode', this.changeDisplayMode);
            this.listenTo(this.model, 'change:total', this.changeTotal);
            this.listenTo(this.model, 'change:eachTotal', this.changeEachTotal);
        },

        changeDisplayMode: function() {
            var mode = this.model.get('displayMode');

            switch (mode) {
                case 'each':
                    if (!this.eachEl.hasClass('active')) {
                        this.eachEl.addClass('active');
                        this.totalEl.removeClass('active');
                        this.changeEachTotal();
                    }
                    break;
                case 'total':
                    if (!this.totalEl.hasClass('active')) {
                        this.totalEl.addClass('active');
                        this.eachEl.removeClass('active');
                        this.changeTotal();
                    }
                    break;
                default:
                    alert('default');
                    break;
            }
        },

        changeTotal: function() {
            var mode = this.model.get('displayMode'),
                total = this.model.get('total');
            
            if (mode === 'total') {
                this.outputValueEl.text(total);
            }

        },

        changeEachTotal: function() {
            var mode = this.model.get('displayMode'),
                eachTotal = this.model.get('eachTotal');
            
            if (mode === 'each') {
                this.outputValueEl.text(eachTotal);
            }
        }
    });

    var SplitsButtonView = Backbone.View.extend({
        initialize: function() {
            var self = this;

            self.totalButtonEl = self.$el.find('div[data-role="total"]');
            self.splitsButtonEl = self.$el.find('div[data-role="splits"]');
            self.inputEl = this.splitsButtonEl.find('.input-splits');
            self.toggleIconEl = self.splitsButtonEl.find('.js-toggle');

            self.listenTo(this.model, 'change:displayMode', self.changeDisplayMode);
            self.listenTo(this.model, 'change:splitsEditing', self.changeEditingStatus);
            self.listenTo(this.model, 'validate:editingConfirm', self.validateEditingConfirm);
            self.listenTo(this.model, 'update:splits', self.updateSplits);

            self.totalButtonEl.hammer().on(touchMethod, function(e) {self.totalTapped();});
            self.splitsButtonEl.hammer().on(touchMethod, function(e) {self.splitsTapped(e);});  
        },

        updateSplits: function(value) {
            if (!util.isInt(value) && value !== '_') {
                throw errorMessage.incorrectSplits;
            }

            var editing = this.model.get('splitsEditing'),
                currentSplits = this.inputEl.text();

            if (editing) {
                if (value === '_') {
                    // If there's no split inputs and user taped C
                    // same as cancel to total mode
                    if (currentSplits === '_') {
                        this.totalTapped();
                        return;
                    }

                    currentSplits = '_';
                    if (!this.inputEl.hasClass('blink')) {
                        this.inputEl.addClass('blink');
                    }
                } else {
                    if (currentSplits.length > 1) {
                        return;
                    }

                    if (currentSplits === '_') {
                        if (value === '0') return;
                        currentSplits = value;
                    } else {
                        currentSplits += value;
                    }
                    if (this.inputEl.hasClass('blink')) {
                        this.inputEl.removeClass('blink');
                    }
                }

            }

            this.inputEl.text(currentSplits);
        },

        changeEditingStatus: function() {
            var editing = this.model.get('splitsEditing'),
                mode = this.model.get('mode');
            if (editing) {
                this._splitsButtonEditingOn();
                // TODO: keep consisting on editng
            } else {
                this._splitsButtonEditingOff();
                if (this.splitsButtonEl.hasClass('btn-blue')) {
                    this.model.changeDisplayMode('each');
                    this.model.changeSplits(parseInt(this.inputEl.text()));
                }
            }

        },

        changeDisplayMode: function() {
            var mode = this.model.get('displayMode'),
                editing = this.model.get('splitsEditing');
            switch (mode) {
                case 'total':
                    this._activateTotalButton();
                    this._deactivateSplitsButton();

                    if (editing) {
                        this.model.changeEditing(false);
                    }
                    break;
                case 'each':
                    this._deactivateTotalButton();
                    this._activateSplitsButton();

                    // if (!editing) {
                    //     this.model.changeEditing(true);
                    // }
                    break;
                default:
                    break;
            }
        },

        totalTapped: function() {
            this.model.changeDisplayMode('total');
        },

        validateEditingConfirm: function() {
            var isValid = this.inputEl.text() !== '_';
            if (isValid) {
                this.model.changeEditing(false);
            } else {
                // TODO: need response
                console.error(errorMessage.incorrectSplits);
            }
        },

        splitsTapped: function(e) {
            var editing = this.model.get('splitsEditing');
            if (editing) {
                this.validateEditingConfirm();
            } else {
                this.model.changeEditing(true);
                this._activateSplitsButton();
                this._deactivateTotalButton();
            }
        },

        _splitsButtonEditingOn: function() {
            this._activateSplitsButton();

            if (!this.splitsButtonEl.hasClass('updating')) {
                this.inputEl.text('_');
                if (!this.inputEl.hasClass('blink')) {
                    this.inputEl.addClass('blink');
                }
                this.splitsButtonEl.addClass('updating');
            }
        },

        _splitsButtonEditingOff: function() {
            if (this.splitsButtonEl.hasClass('updating')) {
                this.splitsButtonEl.removeClass('updating');
            }
        },

        _activateSplitsButton: function() {
            if (!this.splitsButtonEl.hasClass('btn-blue')) {
                this.splitsButtonEl.addClass('btn-blue');
                this.inputEl.addClass('active');
                this.toggleIconEl.hide();
            }
        },

        _deactivateSplitsButton: function() {
            this._splitsButtonEditingOff();
            if (this.splitsButtonEl.hasClass('btn-blue')) {
                this.splitsButtonEl.removeClass('btn-blue');
                this.inputEl.removeClass('active');
                this.toggleIconEl.show();
            }
        },

        _activateTotalButton: function() {
            if (!this.totalButtonEl.hasClass('btn-blue')) {
                this.totalButtonEl.addClass('btn-blue');
            }
        },

        _deactivateTotalButton: function() {
            if (this.totalButtonEl.hasClass('btn-blue')) {
                this.totalButtonEl.removeClass('btn-blue');
            }
        }

    });

    var PercentageButtonView = Backbone.View.extend({
        initialize: function() {
            var self = this;

            // TODO: use event delegation
            self.$el.find('.btn[data-role="tip"]').hammer().on(touchMethod, function(e) {self.percentageTapped(e);});
        },

        percentageTapped: function(e) {
            var me = $(e.target);
            this.$el.find('.btn-pink').removeClass('btn-pink');
            me.addClass('btn-pink');
            this.model.changePercentage(parseInt(me.attr('data-percentage')));
        }
    });

    var CommonButtonView = Backbone.View.extend({
        initialize: function() {
            var self = this;

            this.numButtonEl = self.$el.find('.btn[data-role="num"]');
            this.updateConfirmButtonEl = self.$el.find('.btn[data-role="updateconfirm"]');
            this.ptButtonEl = self.$el.find('.btn[data-role="pt"]');
            this.clearButtonEl = self.$el.find('.btn[data-role="clear"]');

            self.listenTo(self.model, 'change:splitsEditing', self.changeSplitsEditing);

            this.updateConfirmButtonEl.hammer().on(touchMethod, function(e) {self.updateConfirmTapped(e);});
            this.numButtonEl.hammer().on(touchMethod, function(e) {self.numTapped(e);});
            this.ptButtonEl.hammer().on(touchMethod, function(e) {self.ptTapped(e);});
            this.clearButtonEl.hammer().on(touchMethod, function(e) {self.clearTapped(e);});
        },

        changeSplitsEditing: function() {
            var editing = this.model.get('splitsEditing');
            if (editing) {
                this._numEditingOn();
                this._ptEditingOn();
                this._clearEditingOn();
                this._updateConfirmEditingOn();
            } else {
                this._numEditingOff();
                this._ptEditingOff();
                this._clearEditingOff();
                this._updateConfirmEditingOff();
            }
        },

        updateConfirmTapped: function(e) {
            this.model.trigger('validate:editingConfirm');
        },

        numTapped: function(e) {
            var value = $(e.target).text(),
                editing = this.model.get('splitsEditing');

            if (editing) {
                this.model.trigger('update:splits', value);
            } else {
                var bill = this.model.get('bill'),
                    pointIndex = bill.indexOf('.');

                if (value === '.') {
                    if (pointIndex !== -1) {
                        return;
                    }
                    bill = bill + value;
                } else {
                    if (pointIndex != -1 && (pointIndex > 5 || bill.length - pointIndex > 2)) {
                        return;
                    } else {
                        if (pointIndex === -1 && bill.length > 4) {
                            return;
                        }

                        if (bill === '0') {
                            if (value === '0') {
                                return;
                            } else {
                                bill = value;
                            }
                        } else {
                            bill = bill + value;
                        }
                    }
                }

                this.model.changeBill(bill);
            }
        },

        ptTapped: function(e) {
            var bill = this.model.get('bill'),
                pointIndex = bill.indexOf('.');

            if (pointIndex !== -1) {
                return;
            }
            bill = bill + '.';
            this.model.changeBill(bill);
        },

        clearTapped: function(e) {
            var editing = this.model.get('splitsEditing');
            if (editing) {
                this.model.trigger('update:splits', '_');
            } else {
                this.model.changeBill('0');
            }
        },

        _numEditingOn: function() {
            if (!this.numButtonEl.hasClass('updating')) {
                this.numButtonEl.addClass('updating');
            }
        },

        _numEditingOff: function() {
            if (this.numButtonEl.hasClass('updating')) {
                this.numButtonEl.removeClass('updating');
            }
        },

        _updateConfirmEditingOn: function() {
            this.updateConfirmButtonEl.show();
        },

        _updateConfirmEditingOff: function() {
            this.updateConfirmButtonEl.hide();
        },

        _ptEditingOn: function() {
            this.ptButtonEl.hide();
        },

        _ptEditingOff: function() {
            this.ptButtonEl.show();
        },

        _clearEditingOn: function() {
            if (!this.clearButtonEl.hasClass('updating')) {
                this.clearButtonEl.addClass('updating');
            }
        },

        _clearEditingOff: function() {
            if (this.clearButtonEl.hasClass('updating')) {
                this.clearButtonEl.removeClass('updating');
            }
        }
    });    

    return {
        App: App,
        Model: Model,
        InputScreen: InputScreen,
        OutputScreen: OutputScreen,
        SplitsButtonView: SplitsButtonView,
        PercentageButtonView: PercentageButtonView,
        CommonButtonView: CommonButtonView,
        SettingsView: SettingsView
    }
});