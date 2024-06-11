export default {
  isIE: /MSIE|Trident/.test(window.navigator.userAgent),
  isIOS: /iPhone|iPad|iPod/i.test(window.navigator.userAgent),
  isPhantom: /PhantomJS/i.test(window.navigator.userAgent) || !!window._phantom
};
