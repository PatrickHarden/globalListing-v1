// Write async Script tag for social assets using a promise.
export default class asyncScriptTag {
	write(tagSrc, tagId) {
    return new Promise(function (resolve, reject) {
      var s;
      s = document.createElement('script');
      s.src = tagSrc;
      s.onload = function() {
      	resolve();
      };
      s.onerror = reject;
      s.id = tagId
      document.head.appendChild(s);
    });
	}
}