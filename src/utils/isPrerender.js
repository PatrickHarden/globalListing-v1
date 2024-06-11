module.exports = function() {
    return (
        /PhantomJS/.test(window.navigator.userAgent) ||
        /Prerender/i.test(window.navigator.userAgent)
    );
};
