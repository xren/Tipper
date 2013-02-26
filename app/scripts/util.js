(function($, exports) {
	exports.util = {
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
    	}
	}
})(jQuery, window);