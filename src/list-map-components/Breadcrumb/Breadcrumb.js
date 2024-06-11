import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import createQueryString from '../../utils/createQueryString';
import AddressSummary from '../../components/Property/PropertyComponents/AddressSummary';

const Breadcrumb = (
    {
        address,
        appRoot,
        backToSearch,
        parentPropertyUrl,
        searchContext,
        searchPostcode,
        subdivisionName
    },
    context
) => {
    const { ConfigStore, ParamStore } = context.stores;
    const { BackToHomepage, SearchResultsButtonText } = context.language;
    const breadcrumbPrefix = ConfigStore.getItem('breadcrumbPrefix');
    const features = ConfigStore.getItem('features');

    const buildSearchHref = () => {
        let href;

        const searchMode = ConfigStore.getItem('searchMode');
        const configSearchContext = ParamStore.getSearchContext();

        if (!configSearchContext) {
            const searchConfig = ConfigStore.getItem('searchConfig') || {};
            href = searchConfig.searchResultsPage;

            if (searchMode === 'pin' || searchMode === 'bounding') {
                href = `${href}${searchContext || ''}`;
            }
        } else {
            href = `${configSearchContext.path}${
                !isEmpty(configSearchContext.query)
                    ? createQueryString(configSearchContext.query)
                    : ''
            }`;
        }

        return href;
    };

    const renderBreadcrumbPrefix = () => {
        return (
            !!breadcrumbPrefix &&
            breadcrumbPrefix.map(({ text, url }, i) => (
                <li className="breadcrumb_item" key={`${i}_${url}`}>
                    <a href={url}>{text}</a>
                </li>
            ))
        );
    };

    const renderAddress = () => {
        if (!address && (!parentPropertyUrl && !subdivisionName)) {
            return null;
        }
        return (
            <li className="breadcrumb_item">
                {parentPropertyUrl && subdivisionName ? (
                    subdivisionName
                ) : (
                    <AddressSummary address={address} />
                )}
            </li>
        );
    };

    
    const postalBreadcrumb = () => {
        if (features === null || typeof features.disablePostalBreadcrumb === 'undefined' || features.disablePostalBreadcrumb === false) {
            return (
                <li className="breadcrumb_item">
                    {backToSearch && (
                        <a onClick={backToSearch} href={buildSearchHref()}>
                            {SearchResultsButtonText}
                            <span className="lowlight">{searchPostcode}</span>
                        </a>
                    )}
                    {!backToSearch && SearchResultsButtonText}
                </li>
            );
        }
    };
    
    return (
        <ol className="breadcrumb hide-xs show-md">
            {!!breadcrumbPrefix && renderBreadcrumbPrefix()}
    
            {!breadcrumbPrefix && (
                <li className="breadcrumb_item">
                    <a href={appRoot}>{BackToHomepage}</a>
                </li>
            )}
            {postalBreadcrumb()}
            {parentPropertyUrl && (
                <li className="breadcrumb_item">
                    <a href={parentPropertyUrl}>
                        <AddressSummary address={address} />
                    </a>
                </li>
            )}
    
            {renderAddress()}
        </ol>
    );
};

Breadcrumb.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};

Breadcrumb.PropTypes = {
    appRoot: PropTypes.string.isRequired,
    address: PropTypes.shape({}),
    backToSearch: PropTypes.func,
    parentPropertyUrl: PropTypes.string,
    searchContext: PropTypes.string,
    searchPostcode: PropTypes.string,
    subdivisionName: PropTypes.string
};

Breadcrumb.defaultProps = {
    address: null,
    backToSearch: null,
    parentPropertyUrl: null,
    searchContext: '',
    searchPostcode: null,
    subdivisionName: null
};

export default Breadcrumb;
