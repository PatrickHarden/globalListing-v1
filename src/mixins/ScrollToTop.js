var ReactDOM = require('react-dom'),
    $ = require('jQuery');

var scrollToTop = {
    _container: [],

    componentDidMount: function() {
        this._container = $(ReactDOM.findDOMNode(this));
        this._scrollToTop();
    },

    componentWillUpdate: function() {
        this._scrollToTop();
    },

    _scrollToTop: function() {
        if (this._container.length) {
            $('html, body').animate({
                scrollTop: this._container.offset().top
            });
        }
    }
};

module.exports = scrollToTop;
