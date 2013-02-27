require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min',
    backbone: 'vendor/backbone-min',
    underscore: 'vendor/underscore-min',
  	add2home: 'vendor/add2home',
  	hammer: 'vendor/jquery.hammer',
    cookie: 'vendor/jquery.cookie',
    util: 'util',
    modernizr: 'vendor/modernizr.min'
  }
});
require(['add2home']);
require(['app'], function(module) {
	var userAgent = navigator.userAgent.toLowerCase();
	if (!util.isIOS(userAgent)) {
		// alert('PD');
		// $('#tipper').hide();
	} else {
		$('#tipper').show();		
		var app = new module;
	}
});