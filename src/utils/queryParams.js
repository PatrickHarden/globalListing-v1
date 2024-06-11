function removeQuestionMark(str) {
    return str[0] === '?' ? str.substr(1) : str;
}

module.exports = {
    getQueryParameter: function(name) {
        var name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },
    
    parseQueryString: function(queryString) {
        if (typeof queryString !== 'string') {
            return false;
        }

        var parsedString = removeQuestionMark(queryString);
        var params = {};

        var queries = parsedString.split('&');

        queries.forEach(function(query) {
            var temp = query.split('=');
            return (params[temp[0]] = temp[1]);
        });

        return params;
    },

    parseQueryObject: function(queryObject, addPrefix) {
        if (typeof queryObject !== 'object') {
            return false;
        }

        var params = [];
        addPrefix = !!addPrefix;

        for (var query in queryObject) {
            params.push(query + '=' + queryObject[query]);
        }

        params = params.join('&');

        if (addPrefix) {
            params = '?' + params;
        }

        return params;
    }
};
