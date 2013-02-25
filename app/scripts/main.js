require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min',
    backbone: '../components/backbone/backbone-min',
    underscore: '../components/underscore/underscore-min',
  	add2home: 'vendor/add2home'
  }
});
require(['add2home']);
require(['app'], function(module) {
	var app = new module;
});