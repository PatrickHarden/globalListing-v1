import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TranslateString from '../../utils/TranslateString';
import PropertyCard from '../PropertyCard/PropertyCard';
import { chunk } from 'lodash';
import letterFromIndex from '../../utils/letterFromIndex';

class PdfList extends Component {
    renderListItems = () => {
        const {
            spaPath,
            siteType,
            properties
        } = this.props;

        let inc = -1;
        const rows = chunk(properties, 2);
        return rows.map((row, i) => (
            <div
                key={`row${i}`}
                className="row"
            >
                {
                    row.map((property) => {
                        inc ++;
                        return (
                            <PropertyCard
                                key={`pdfList_${property.PropertyId}`}
                                property={property}
                                propertyIndex={inc}
                                spaPath={spaPath}
                                siteType={siteType}
                                className="staticListings_Item col-xs-6"
                                showFavourites={false}
                                isPdf
                            />
                        );
                    })
                }
            </div>
        ));
    };

    render() {
        const {
            properties,
            staticMaps
        } = this.props;

        const listMap = staticMaps.find(map => {
            return map.Id === 'staticMapList';
        }) || {};

        return (
            <div className="main">
                <img
                    className="staticListingsMap"
                    src={listMap.Url}
                />

                <div className="pdf_body">

                    <div className="pdf_header">
                        <h2 className="cbre_h3">
                            <TranslateString
                                start={letterFromIndex(0)}
                                end={letterFromIndex(properties.length - 1)}
                                string="PdfListTitle"
                            />
                        </h2>
                    </div>

                    <div className="staticListings">
                        {this.renderListItems()}
                    </div>

                </div>
            </div>
        );
    }
}

PdfList.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

PdfList.propTypes = {
    spaPath: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    properties: PropTypes.array.isRequired,
    staticMaps: PropTypes.array.isRequired
};

export default PdfList;