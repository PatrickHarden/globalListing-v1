
import React from 'react';
import { Grid, Row } from 'react-bootstrap';
var ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    match = require('react-router'),
    writeMetaTag = require('../../utils/writeMetaTag');
var StoresMixin = require('../../mixins/StoresMixin');

var createReactClass = require('create-react-class');

var PageNotFound = createReactClass({
    displayName: 'PageNotFound',
    mixins: [LanguageMixin, ComponentPathMixin, StoresMixin],

    render: function () {
        const pushRoute = (route) => {
            this.props.router.push(route);
            document.body.classList.add("redirect");
        }


        writeMetaTag('prerender-status-code', 404, 'html');

        window.prerenderReady = true;
        const { language, config } = this.props;

        const { searchConfig } = config;
    
        return (
            <Grid fluid>
                <Row className={'cbre-spa-404'}>
                    {config && config.searchConfig && config.searchConfig.searchResultsPage && !config.features.redirect &&
                        pushRoute(config.searchConfig.searchResultsPage)
                    }
                    <div className="container">
                        <h3>{language.ErrorPageNotFoundTitle}</h3>
                        <p>{language.ErrorPageNotFoundText}</p>
                        <a href={encodeURI(searchConfig.searchResultsPage)}>
                            {language.ErrorPageSearchPageText}
                        </a>
                    </div>
                </Row>
            </Grid>
        );
    }
});

module.exports = PageNotFound;
