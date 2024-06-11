module.exports = {
    isIE: /MSIE|Trident/.test(window.navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(window.navigator.userAgent),
    isPhantom:
        /PhantomJS/i.test(window.navigator.userAgent) || !!window._phantom,
    isPrerender:
        /Prerender/i.test(window.navigator.userAgent) ||
        /PhantomJS/.test(window.navigator.userAgent) ||
        !!window._phantom,
    isWebkit: 'WebkitAppearance' in document.documentElement.style
};
