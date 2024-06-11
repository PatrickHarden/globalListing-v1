import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import redirect from '../utils/301redirect';
import Places from '../utils/Places';
import writeMetaTag from '../utils/writeMetaTag';

import CaptureError from '../utils/captureError';
export default function redirectContainer(WrappedComponent, spaPath) {
    class Redirect extends Component {
        constructor(props) {
            super(props);
            this.throwError = this.throwError.bind(this);
            this.state = {
                error: null
            };
        }

        componentWillMount() {
            const { location } = this.props;

            const { router } = this.context;

            const query = Object.assign({}, location.query);

            // If the url contains a placeID but no location param...
            if (
                query.hasOwnProperty('placeId') &&
                !query.hasOwnProperty('location')
            ) {
                Places.lookup(
                    { placeId: query.placeId },
                    function(result) {
                        if (typeof result.location !== 'undefined') {
                            query.location = result.gmaps.formatted_address;
                            redirect(router, location.pathname, query);
                        }
                    },
                    function() {
                        console.warn(
                            `Could not find a match for placeID: ${
                                query.placeId
                            }`
                        ); // eslint-disable-line
                    }
                );
            }
        }

        componentDidMount() {
            // Handle errors.
            const applicationStore = this.context.stores.ApplicationStore;
            applicationStore.onChange(
                'CONFIG_ERROR',
                this.throwError.bind(null, 'CONFIG_ERROR')
            );
            applicationStore.onChange(
                'APPLICATION_ERROR',
                this.throwError.bind(null, 'APPLICATION_ERROR')
            );
            applicationStore.onChange(
                'API_ERROR',
                this.throwError.bind(null, 'API_ERROR')
            );
            applicationStore.onChange(
                'PLACES_ERROR',
                this.throwError.bind(null, 'PLACES_ERROR')
            );
        }

        componentWillUnmount() {
            const applicationStore = this.context.stores.ApplicationStore;
            applicationStore.off('CONFIG_ERROR', this.throwError);
            applicationStore.off('APPLICATION_ERROR', this.throwError);
            applicationStore.off('API_ERROR', this.throwError);
            applicationStore.off('PLACES_ERROR', this.throwError);
        }

        throwError(error) {
            this.setState({
                error: error
            });
        }

        render() {
            const config = this.context.stores.ConfigStore.getConfig();
            const { error } = this.state;
            const { stores, language } = this.context;

            let props = Object.assign({}, this.props);
            props.error = error;

            let markup = <WrappedComponent {...props} />;
            if (error) {
                CaptureError(
                    'Component Error',
                    {
                        component: 'redirectContainer',
                        errorType: error,
                        config: config,
                        path: window.location.href
                    },
                    { site: config.siteId }
                );
            }
            switch (error) {
                case 'APPLICATION_ERROR':
                    // var errorDetail = stores.ApplicationStore.getApplicationError();
                    // markup = <Redirect to={spaPath.path + '/PageNotFound'} />;
                    window.location.assign(spaPath.path + '/PageNotFound');
                    // writeMetaTag(
                    //     'prerender-status-code',
                    //     errorDetail.statusCode,
                    //     'html'
                    // );
                    // window.prerenderReady = true;
                    // markup = (
                    //     <div className="cbre_error cbre_error-application">
                    //         <h3>{errorDetail.message}</h3>
                    //         <p>{errorDetail.detail}</p>
                    //     </div>
                    // );
                    break;
                case 'CONFIG_ERROR':
                    markup = (
                        <div className="cbre_error cbre_error-config">
                            <h3>We're sorry, there has been an error.</h3>
                            <p>Please try again later.</p>
                        </div>
                    );
                    break;
                case 'PLACES_ERROR':
                    markup = (
                        <div className="cbre_error cbre_error-places">
                            <h3>{language.ErrorSubTitle}</h3>
                            <p>{language.ErrorText}</p>
                        </div>
                    );
                    break;
            }

            return markup;
        }
    }

    Redirect.contextTypes = {
        router: PropTypes.object.isRequired,
        stores: PropTypes.object.isRequired,
        language: PropTypes.object.isRequired
    };

    return Redirect;
}
