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
    modernizr: 'vendor/modernizr.min'
  }
});
require(['add2home']);
require(['app'], function(module) {
	var userAgent = navigator.userAgent.toLowerCase();
    if (!isIPhone(userAgent)) {
	   var app = new module;
    } else {
        $('.overlay').addClass('active');
    }
    
    function isIPhone(userAgent) {
        return userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1;
    }
});