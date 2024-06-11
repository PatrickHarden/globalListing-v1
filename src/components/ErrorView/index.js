var PropTypes = require('prop-types');
var React = require('react');
var createReactClass = require('create-react-class');
var ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname);
import { Grid } from 'react-bootstrap';
var ErrorView = createReactClass({
    displayName: 'ErrorView',
    mixins: [ComponentPathMixin],

    propTypes: {
        title: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired
    },

    render: function() {
        return (
            <Grid>
                <div className={this.props.className}>
                    <h3>{this.props.title}</h3>
                    {this.props.children}
                </div>
            </Grid>
        );
    }
});

module.exports = ErrorView;
