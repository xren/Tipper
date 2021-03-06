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
    mocha: 'vendor/mocha',
    chai: 'vendor/chai',
    expect: 'vendor/expect'
  }
});
require(['add2home']);
// require(['util']);
// require(['chai', 'mocha',  'expect'], function(chai) {
//     assert = chai.assert;
//     expect = chai.expect;
    
//     mocha.setup('bdd');

//     require(['test'], function(module) {
//         mocha.run();
//     });
// });
require(['util', 'tipper'], function(utils, module) {
 var userAgent = navigator.userAgent.toLowerCase();
    if (util.isDev() || util.isIOSMobile(userAgent) || util.isLab()) {
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

        if (util.isIOSMobile(userAgent)) {
            // TODO: Refactor this!!
            if (window.navigator.standalone) {
                if (_gaq && 
                    (window.location.href.indexOf('rexren.com/apps/tipper') !== -1 || 
                     window.location.href.indexOf('rexren.com/tipper') !== -1)) {
                    console.log('standalone app yay!');
                    _gaq.push(['_trackEvent', 'User', 'Open', 'open - ios - standalone']);
                }
            } else {
                // Change the layout inorder to fit screen when open with safari
                if ('screen' in window && window.screen.availHeight === 548) {
                    // iPhone 5
                    $('.btn').css({
                        'padding-top': '0.6em',
                        'padding-bottom': '1.8em'
                    });
                }  else {
                    // iPhone < 5
                    $('.btn').css({
                        'padding-top': '0.4em',
                        'padding-bottom': '1.6em'
                    });
                }
                // Hide address bar in safari
                util.hideAddressBar();
            }
        }
    } else {
        $('.overlay').addClass('active');
    }
});