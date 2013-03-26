require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min',
    backbone: 'vendor/backbone-min',
    underscore: 'vendor/underscore-min',
  	add2home: 'vendor/add2home',
    hammer: 'vendor/hammer',
  	jqueryhammer: 'vendor/jquery.hammer',
    cookie: 'vendor/jquery.cookie',
    util: 'util',
    modernizr: 'vendor/modernizr.min',
  }
});
require(['util', 'tipper'], function(utils, module) {
    var model = new module.Model({slient: true}),
        app = new module.App({
            model: model,
            appVersion: '0.8.1',
            el: $('body')
        }),
        inputScreen = new module.InputScreen({
            model: model,
            el: $('.screen-input')
        }),
        outputScreen = new module.OutputScreen({
            model: model,
            el: $('.screen-output')
        }),
        splitsButtonView = new module.SplitsButtonView({
            model: model,
            el: $('div[data-content="btn-splits"]')
        }),
        percentageButtonView = new module.PercentageButtonView({
            model: model,
            el: $('div[data-content="btn-percentage"]')
        }),
        commonButtonView = new module.CommonButtonView({
            model: model,
            el: $('div[data-content="btn-common"]')
        }),
        settingsView = new module.SettingsView({
            model: model,
            el: $('#settings')
        });
});