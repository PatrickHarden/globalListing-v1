var writeMetaTag = require('../writeMetaTag'),
    $ = require('jQuery');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

describe('Writing meta tags', function () {

    describe('When writing a new tag of unspecified type', function () {
        var tagName = 'newtag-' + guid();
        var value = guid();
        writeMetaTag(tagName, value);        

        it('should create a new meta tag with name and value', function () {
            var $item = $('meta[property="' + tagName + '"]');
            expect($item.length).toBe(1);
            expect($item.attr('content')).toBe(value);
        });
    });
    
    describe('When writing a new meta tag', function () {
        
        var tagName = 'newtag-' + guid();
        var value = guid();
        writeMetaTag(tagName, value);        

        it('should create a new meta tag with property and value', function () {
            var $item = $('meta[property="' + tagName + '"]');
            expect($item.length).toBe(1);
            expect($item.attr('content')).toBe(value);
        });
    });
    
    describe('When writing a new link tag', function () {
        
        var relType = 'newlink-' + guid();
        var value = guid();
        writeMetaTag(relType, value, 'link');        

        it('should create a new meta tag with name and value', function () {
            var $item = $('link[rel="' + relType + '"]');
            expect($item.length).toBe(1);
            expect($item.attr('href')).toBe(value);
        });
    });

    describe('When writing a new html tag', function () {
        var tagName = 'newhtmltag-' + guid();
        var value = guid();
        writeMetaTag(tagName, value, 'html');

        it('should create a new meta tag with name and content', function () {
            var $item = $('meta[name="' + tagName + '"]');
            expect($item.length).toBe(1);
            expect($item.attr('content')).toBe(value);
        });
    });

    describe('When writing a title', function () {

        it('should create a new title with value', function () {
            var value = guid();
            writeMetaTag(null, value, 'title');
            var $item = $('title');

            expect($item.length).toBe(1);
            expect($item[0].innerText).toBe(value);
            expect(window.title).toBe(value);
        });
    });
    
    describe('When writing a tag that already exists', function () {
        
        var tagName = 'newtag-' + guid();
        // write first time
        var value = guid();
        writeMetaTag(tagName, value);        
        // over write
        value = guid();
        writeMetaTag(tagName, value);        

        it('should set the value of the tag to the new value', function () {
            var $item = $('meta[property="' + tagName + '"]');
            expect($item.length).toBe(1);
            expect($item.attr('content')).toBe(value);
        });
    });
});
