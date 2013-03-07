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
// require(['ga']);
require(['app'], function(module) {
	var userAgent = navigator.userAgent.toLowerCase();
    if (isDev() || isIOSMobile(userAgent)) {
        var app = new module;
        // If user on mobile safari, hide addressbar to enlarge the view area
        if (!isStandAlone(userAgent) && isIOSMobile(userAgent)) {
            hideAddressBar();
        }
    } else {
        $('.overlay').addClass('active');
    }

    /* Support functions */
    // iPhone or iPod
    function isIOSMobile(userAgent) {
        return userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1;
    }

    // check if it is under development envrionment
    function isDev() {
        return window.location.href.indexOf('rexren.com') === -1;
    }

    // check if it is launched from home screen
    function isStandAlone(userAgent) {
        return ('standalone' in window.navigator &&
                window.navigator.standalone &&
                isIOSMobile(userAgent)) 
    }

    function hideAddressBar() {
        if (document.height <= window.outerHeight + 10) {
            document.body.style.height = (window.outerHeight + 60) + 'px';
            setTimeout(function() {window.scrollTo(0, 1);}, 50);
        } else {
            setTimeout(function() {window.scrollTo(0, 1);}, 0);
        }
    }
});