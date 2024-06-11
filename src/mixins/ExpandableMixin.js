var ReactDOM = require('react-dom');

var ExpandableMixin = {

    componentDidMount: function() {
        var element = ReactDOM.findDOMNode(this);

        if (element) {
            var toggleNode = element.getElementsByClassName('expand-toggle');
            if (toggleNode.length > 0)
            {
                toggleNode[0].addEventListener('click', this.handleClick);
            }
        }
    },

    handleClick: function(){
        var mainNode = ReactDOM.findDOMNode(this);
        if ( mainNode.classList.contains('expanded') )
        {
            mainNode.classList.remove('expanded');
        }
        else
        {
            mainNode.classList.add('expanded');
        }
    }
};

module.exports = ExpandableMixin;
