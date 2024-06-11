var $ = require('jQuery');

var Ajax = {
    call: function(url, success, error) {
        error = error || function() {};

        $.ajax({
            url : url,
            dataType: 'json',
            method: 'GET',
            tryCount : 0,
            retryLimit : 2,

            success : function(data) {
                success(data);
            },

            error : function(jqXHR) {
                if (jqXHR.status === 404 || jqXHR.status === 400) {
                    error(jqXHR.status);
                } else {
                    window.setTimeout(function(){
                        this.tryCount ++;
                        if (this.tryCount <= this.retryLimit) {
                            $.ajax(this);
                        } else {
                            error(jqXHR.status);
                        }
                    }.bind(this), 500);
                }
            }
        });
    }
};

module.exports = Ajax;
