import PropTypes from 'prop-types';
import React from 'react';
import defaultValues from '../../constants/DefaultValues';
import moment from 'moment/min/moment-with-locales.min';

function PdfHeader(props, context){
    const {
        language,
        stores
    } = context;

    const {
        siteType
    } = props;

    const currentLanguage = stores.ConfigStore.getItem('language');

    let date = new moment();
    date = date.locale(currentLanguage).format(defaultValues.pdfDateFormat);

    const siteLink = (siteType !== 'residential') ? (<a href="#" className="headerLogoWrap_cbreLink">{language.PdfHeaderLinkText}</a>) : null;

    return (
        <div className="cbre_simpleHeader">
            <div className="headerLogoWrap">
                <a href="/" className="cbre_icon cbre_icon_logo">
                    <span className="sr-only">{language.SrOnlyPdfLogoText}</span>
                </a>
                {siteLink}
            </div>

            <div className="text-xs-right">
                <div className="cbre_headerTitle">{language.PdfHeaderTitle}</div>
                <div className="cbre_smallText">{date}</div>
            </div>
        </div>
    );
}

PdfHeader.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

PdfHeader.propTypes = {
    siteType: PropTypes.string.isRequired
};

export default PdfHeader;