define(['http://www.google-analytics.com/ga.js'], function() {
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-38777943-1']);
        _gaq.push(['_setDomainName', 'rexren.com']);
		_gaq.push(['_trackPageview']);    

    if (window.location.href.indexOf('rexren.com/apps/tipper') !== -1 ||
        window.location.href.indexOf('rexren.com/tipper') !== -1) {
	} else {
        console.log('This is not a stable version, expecting bugs');
    }
});