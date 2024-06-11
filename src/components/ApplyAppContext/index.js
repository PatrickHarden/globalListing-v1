var PropTypes = require('prop-types');
var React = require('react');
import { fireEvent, fireTracking } from '../analytics/gl-analytics';

class ApplyAppContext extends React.Component {
    static displayName = 'ApplyAppContext';

    static propTypes = {
        passContext: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
        location: PropTypes.object,
        className: PropTypes.string
    };

    static childContextTypes = {
        stores: PropTypes.object,
        actions: PropTypes.object,
        language: PropTypes.object,
        searchType: PropTypes.string,
        history: PropTypes.object,
        location: PropTypes.object,
        spaPath: PropTypes.object,
        ContactModal: PropTypes.func,
        analytics: PropTypes.object
    };

    getChildContext() {
        var context = this.props.passContext;

        return {
            stores: context.stores,
            actions: context.actions,
            language: context.language,
            searchType: context.searchType,
            history: context.history,
            location: context.location || this.props.location,
            spaPath: context.spaPath,
            ContactModal: context.ContactModal,
            analytics: {
                fireTracking: () => { fireTracking(); },
                fireEvent: (...eventData) => { fireEvent(...eventData); }
            }
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.children}
            </div>
        );
    }
}


module.exports = ApplyAppContext;