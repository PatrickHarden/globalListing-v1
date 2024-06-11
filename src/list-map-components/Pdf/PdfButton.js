import PropTypes from 'prop-types';
import React from 'react';
import defaultValues from '../../constants/DefaultValues';
import trackingEvent from '../../utils/trackingEvent';
import getDocumentRoot from '../../utils/getDocumentRoot';
import { Link } from 'react-router';

function PdfButton(props, context){
    const {
        show,
        viewInBrowser
    } = props;

    const {
        spaPath,
        actions,
        language,
        stores
    } = context;

    if(!show || !stores.ConfigStore.getItem('features').printFavourites) {
        return null;
    }

    const {
        pdfDownloadApi,
        renderMiddleware
    } = Object.assign({}
        , defaultValues.pdf
        , stores.ConfigStore.getItem('pdf')
    );

    const pathname = getDocumentRoot() + (spaPath.path === '/' ? '' : spaPath.path) + '/generate-pdf';

    const LinkType = viewInBrowser ? Link : 'a';
    const properties = actions.getFilteredFavouriteParamsValues();
    const additionalParam = '';

    let linkProps = viewInBrowser ? {
        to: {
            pathname,
            query: {
                properties
            }
        }
    } : {
        href: `${pdfDownloadApi}?document=${renderMiddleware}${pathname}&qs=properties=${properties}${additionalParam}`,
        target: '_blank'
    };

    linkProps.onClick = () => {
        trackingEvent('clickedDownloadPdf', {}, stores, actions);
    };

    return (
        <LinkType className="cbre_button cbre_button__icon" {...linkProps}>
            <span className="cbre_icon_print cbre_icon">&nbsp;</span>
            <span className="sr-only">{language.SrOnlyPrintButtonText}</span>
        </LinkType>
    );
}

PdfButton.contextTypes = {
    language: PropTypes.object,
    actions: PropTypes.object,
    spaPath: PropTypes.object,
    stores: PropTypes.object
};

PdfButton.propTypes = {
    show: PropTypes.bool,
    viewInBrowser: PropTypes.bool
};

export default PdfButton;