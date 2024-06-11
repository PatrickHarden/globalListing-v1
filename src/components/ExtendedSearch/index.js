var React = require('react');
var searchStateContainer = require('../../containers/searchStateContainer');
var propertiesContainer = require('../../containers/propertiesContainer');

class ExtendedSearch extends React.Component {
    render() {
        var fullResultCount = this.props.totalResults;
        var extendedSearch =  this.props.extendedSearch;

        if (!!extendedSearch && fullResultCount > 0) {
            return (this.props.children);
        }
        return null;
    }
}

module.exports = propertiesContainer(
    searchStateContainer(ExtendedSearch), {
        bypassLoader: true
    }
);
