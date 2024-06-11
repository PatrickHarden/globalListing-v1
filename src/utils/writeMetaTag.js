var $ = require('jQuery');

module.exports = function(name, value, type){
    type = type || 'meta';
    var _type = type === 'html' ? 'meta' : type,
        tag = document.createElement(_type),
        $ex;
    switch(type) {
        case 'title':
            tag.innerText = window.title = value;
            $ex = $('title');
            break;
        case 'link':
            tag.rel = name;
            tag.href = value;
            $ex = $('link[rel="' + name + '"]');
            break;
        case 'html':
            tag.name = name;
            tag.content = value;
            $ex = $('meta[name="' + name + '"]');
            break;
        default:
            tag.setAttribute('property', name);
            tag.content = value;
            $ex = $('meta[property="' + name + '"]');
    }
    $ex.remove();
    document.getElementsByTagName('head')[0].appendChild(tag);
};
