(function($) {
	window.util = {
		setCookie: function(key, value, options) {
			return $.cookie(key, value, options);
		},

		getCookie: function(key) {
			return $.cookie(key);
		},

		removeCookie: function(key, options) {
			return $.removeCookie(key, options);
		},

		inArray: function(value, array) {
			return $.inArray(value, array);
		},

		clearFields: function(id_list) {
	        for (var _i=0, _len=id_list.length; _i<_len; ++_i) {
	            $(id_list[_i]).val('');
	        }
    	},

    	getBasicSecret: function(username, password) {
            return "Basic " + btoa(username + ':' + password);
    	},

    	getUTCNow: function() {
    		var date = new Date();
    		function pad(n) {return n<10 ? '0'+n : n}
    		return date.getUTCFullYear() + '-'
    			   + pad(date.getUTCMonth() + 1) + '-'
    			   + pad(date.getUTCDate()) + 'T'
    			   + pad(date.getUTCHours()) + ':'
    			   + pad(date.getUTCMinutes()) + ':'
    			   + pad(date.getUTCSeconds()) + 'Z';
    	},

    	isNumber: function(n) {
    		return !isNaN(parseFloat(n)) && isFinite(n);
    	},

    	isInt: function(n) {
			return n.valueOf() % 1 == 0 ? true: false;
    	},

    	isIOS: function(userAgent) {
    		var r = /(iPhone|iPod|iPad)/i;
    		return r.test(userAgent);
    	},

    	isAndroid: function(userAgent) {
    		var r = /(android)/i;
    		return r.test(userAgent);
    	},

    	isMobile: function(userAgent) {
    		var r = /(mobile)/i;
    		return r.test(userAgent);
    	},

    	blink: function(obj, delay) {
    		var me = $(obj);
    		if (me.attr('timerid') > 0) return;
    		var timerid = setInterval(function() {
    			if (me.css('opacity') == '1') {
    				me.css('opacity', '0');
    			} else {
    				me.css('opacity', '1');
    			}
    		}, delay);
    		me.attr('timerid', timerid);
    	},

    	unblink: function(obj) {
    		var me = $(obj),
    			timerid = me.attr('timerid');
    		if (timerid > 0) {
    			clearInterval(timerid);
    			me.attr('timerid', 0);
    			me.css('opacity', '1');
    		}
    	},

        isIOSMobile: function(userAgent) {
            return userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1;
        },

        // check if it is under development envrionment
        isDev: function() {
            return window.location.href.indexOf('rexren.com') === -1;
        },

        isLab: function() {
            return window.location.href.indexOf('rexren.com') !== -1 &&
                   window.location.href.indexOf('lab') !== -1;
        },

        // check if it is launched from home screen
        isStandAlone: function(userAgent) {
            return ('standalone' in window.navigator &&
                    window.navigator.standalone &&
                    isIOSMobile(userAgent)) 
        },

        hideAddressBar: function() {
            if (document.height <= window.outerHeight + 10) {
                document.body.style.height = (window.outerHeight + 60) + 'px';
                setTimeout(function() {window.scrollTo(0, 1);}, 50);
            } else {
                setTimeout(function() {window.scrollTo(0, 1);}, 0);
            }
        }
	}
})(jQuery, window);