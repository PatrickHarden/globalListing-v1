var PropTypes = require('prop-types');
var React = require('react'),
    Translate = require('react-translate-component');

class TranslateString extends React.Component {

    static propTypes = {
        string: PropTypes.string.isRequired,
        appendCommas: PropTypes.any,
        removeSelectCommas: PropTypes.array
    };

    static defaultProps = {
        string: '',
        appendCommas: false,
        removeSelectCommas: []
    };

    render() {
        const { string, component, className, unsafe, appendCommas, removeSelectCommas, ...rest } = this.props;
        let href;
        
        if (component === 'a' && this.props.href) {
            href = { href: this.props.href };
        }

        let values = { ...rest };

        if (appendCommas) {
            // delete the object's property if the property is null, undefined, or empty
            Object.keys(values).forEach((key) => (values[key] == null || values[key] == undefined || values[key] == '' || values[key] == ' ') && delete values[key]);

            const keys = Object.keys(values);
            keys.forEach((key, index) => {
                // if it is not the last property of the object
                if (index !== (keys.length - 1)) {
                    // and if the last character isn't comma, append a comma
                    if (values[key].charAt(values[key].length - 1) != ',') {
                        values[key] += (removeSelectCommas.includes(key) ? '' : ',');
                    }
                }
            });
        }

        return (
            <Translate
                with={values}
                className={className || ''}
                component={component || 'span'}
                content={string}
                {...href}
                unsafe={unsafe}
            />
        );
    }
}

module.exports = TranslateString;
