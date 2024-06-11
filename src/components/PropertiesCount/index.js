var PropTypes = require('prop-types');
var React = require('react');
var TranslateString = require('../../utils/TranslateString');
var propertiesContainer = require('../../containers/propertiesContainer');

class PropertiesCount extends React.Component {
    static propTypes = {
        propertyCount: PropTypes.number
    };

    render() {
        if (!this.props.propertiesHasLoadedOnce) {
            return (<span>&nbsp;</span>);
        }

        return (
            <div>
                <TranslateString {...this.props} />
            </div>
        );
    }
}

module.exports = {
    PropertiesCount: propertiesContainer(PropertiesCount, {
        bypassLoader: true
    }),
    _PropertiesCount: PropertiesCount
};
