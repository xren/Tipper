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
    if (util.isDev() || util.isIOSMobile(userAgent)) {
        var model = new module.Model({slient: true}),
            app = new module.App({
                model: model,
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
            });
        if (!window.navigator.standalone) {
            util.hideAddressBar();
        }
    } else {
        $('.overlay').addClass('active');
    }
});