require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min',
    backbone: '../components/backbone/backbone-min',
    underscore: '../components/underscore/underscore-min'
  }
});
require(['app'], function(module) {
	var app = new module;
});