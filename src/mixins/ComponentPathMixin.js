var ReactDOM = require('react-dom');

var ComponentPathMixin = function(){
    var suffix = '';

    return {
        componentDidMount: function () {
            if(this.props.componentContext){
                suffix = '-' + this.props.componentContext;
            }
            if(this.constructor.displayName && ReactDOM.findDOMNode(this)){
                ReactDOM.findDOMNode(this).setAttribute('data-component-path', this.constructor.displayName + suffix);
            }
        }
    };
};

module.exports = ComponentPathMixin;