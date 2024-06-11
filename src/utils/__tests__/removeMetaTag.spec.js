var writeMetaTag = require('../writeMetaTag'),
    removeMetaTag = require('../removeMetaTag'),
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

describe('Removing meta tags', function () {

    describe('When removing a metatag', function () {
        
        var tagName = 'newtag-' + guid();
        var value = guid();
        writeMetaTag(tagName, value, 'meta');       
        
        removeMetaTag(tagName, 'meta');

        it('should remove the metatag', function () {
            expect($('meta[property="' + tagName + '"]').length).toBe(0); 
        });
    });
    
    describe('When removing a link', function () {
        
        var relType = 'newlink-' + guid();
        var value = guid();
        writeMetaTag(relType, value, 'link');       
        
        removeMetaTag(relType, 'link');

        it('should remove the link', function () {
            expect($('link[rel="' + relType + '"]').length).toBe(0); 
        });
    });
    
    describe('When removing a title', function () {

        it('should remove the title', function () {     
            
            var value = guid();
            writeMetaTag(null, value, 'title');       
            removeMetaTag(null, 'title');
       
            var titleCount = $('title').length;
            expect(titleCount).toBe(0); 
        });
    });
});
