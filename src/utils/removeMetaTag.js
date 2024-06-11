var $ = require('jQuery');

module.exports = function(name, type){
    type = type || 'meta';
    switch(type) {
        case 'link':
            $('link[rel="' + name + '"]').remove();
            break;
        case 'title':
            $('title').remove();
            break;
        default:
            $('meta[property="' + name + '"]').remove();
    }
};
