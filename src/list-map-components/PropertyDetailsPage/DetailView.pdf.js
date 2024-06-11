import PropTypes from 'prop-types';
import React, { Component } from 'react';
import defaultValues from '../../constants/DefaultValues';
import PropertyImage from '../../components/Property/PropertyComponents/PropertyImage';
import AddressSummary from '../../components/Property/PropertyComponents/AddressSummary';
import Bedrooms from '../../components/Property/PropertyComponents/Bedrooms';
import Size from '../../components/Property/PropertyComponents/Size';
import PriceLabel from '../../components/Property/PropertyComponents/PriceLabel';
import FloorsAndUnits from './PDPComponents/FloorsAndUnits';
import LeaseAndCharges from './PDPComponents/LeaseAndCharges';
import EnergyPerformance from './PDPComponents/EnergyPerformance';
import PointsOfInterest from './PDPComponents/PointsOfInterest';
import SizesAndMeasurements from './PDPComponents/SizesAndMeasurements';
import Specification from './PDPComponents/Specification';
import { Avatar, MediaWrapper } from '../../external-libraries/agency365-components/components';
import PdfHeader from '../Pdf/PdfHeader';
import getPath from 'getpath';
import { chunk } from 'lodash';
import letterFromIndex from '../../utils/letterFromIndex';

require('../../utils/docRaptor');

class DetailViewPdf extends Component {
  renderContacts = property => {
    const { contacts } = property.ContactGroup;
    const contactArray = contacts.slice(0, 2);

    return contactArray
      .map((contact, i) => {
        if (!contact.name || contact.name.length === 0) {
          return;
        }

        const image = contact.avatar || '';
        const avatar = (
          <Avatar
            key={`contactAvatar_${i}`}
            src={image}
            size={32}
            altText={contact.name}
          />
        );

        return (
          <table className="contactTable" key={`contact_${i}`}>
            <tbody>
              <tr>
                <td rowSpan="3">
                  <div className="cbre_avatar">
                    {avatar}
                  </div>
                </td>

                <td className="cbre_icon cbre_icon_user">&nbsp;</td>
                <td>
                  {contact.name}
                </td>
              </tr>
              <tr>
                <td className="cbre_icon cbre_icon_phone">&nbsp;</td>
                <td className="is_highlighted">
                  {contact.telephone}
                </td>
              </tr>
              <tr>
                <td className="cbre_icon cbre_icon_mail">&nbsp;</td>
                <td colSpan="3">
                  {contact.email}
                </td>
              </tr>
            </tbody>
          </table>
        );
      })
      .filter(contact => !!contact);
  };

  renderPhotos = property => {
    const { Photos } = property;
    const imageOrientation = this.context.stores.ConfigStore.getItem(
      'imageOrientation'
    );
    const photoLimit = Object.assign(
      {},
      defaultValues.pdf,
      this.context.stores.ConfigStore.getItem('pdf')
    ).limitPropertyImages;

    if (!property.Photos.length) {
      return null;
    }

    const photoArray = Photos.slice(0, photoLimit);
    let fitWidth;
    let fitHeight;
    if (imageOrientation === 'landscape') {
      fitWidth = true;
    }
    if (imageOrientation === 'portrait') {
      fitHeight = true;
    }

    const rows = chunk(photoArray, 2);
    return rows.map((row, a) =>
      <div key={`row${a}`} className="row">
        {row.map((photo, b) =>
          <div className="col-xs-6 marginBottom-xs-1" key={`row${a}_img${b}`}>
            <MediaWrapper fitHeight={fitHeight} fitWidth={fitWidth}>
              <PropertyImage items={photo.resources} alt={photo.caption} />
            </MediaWrapper>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { language } = this.context;

    const {
      property,
      siteType,
      searchType,
      propertyIndex,
      breakpoints,
      renderDisclaimer,
      staticMaps
    } = this.props;

    const {
      ActualAddress,
      Photos = [],
      NumberOfBedrooms,
      FloorPlans,
      StrapLine,
      LongDescription,
      EnergyPerformanceData
    } = property;

    const propertyImage = Photos.length
      ? <div className="imageWrap">
          <PropertyImage items={Photos[0].resources} />
        </div>
      : null;

    const subh2 =
      siteType === 'residential'
        ? <div>
            <Bedrooms bedrooms={NumberOfBedrooms} displayStyling={false} />
            {(property.TotalSize || property.MinimumSize) &&
              <span>
                &nbsp;/&nbsp;
                <Size
                  property={property}
                  displayLabel={false}
                  displayStyling={false}
                />
              </span>}
          </div>
        : <Size
            property={property}
            displayLabel={false}
            displayStyling={false}
          />;

    let sizesAndMeasurements;
    if (siteType !== 'residential') {
      sizesAndMeasurements = (
        <div className="row">
          <div className="col-xs-8">
            <div className="pdf_subheader">
              <h2 className="cbre_h4">
                {language.PdpSizeAndMeasurementsTitle}
              </h2>
            </div>
            <SizesAndMeasurements property={property || {}} />
          </div>
        </div>
      );
    }

    let floorsAvailable = [];
    if (
      property.FloorsAndUnits.length &&
      siteType !== 'residential' &&
      !this.context.stores.ConfigStore.getFeatures().hideFloorsAndUnits
    ) {
      floorsAvailable.push([
        <div className="pdf_subheader is_borderless">
          <h2 className="cbre_h4">
            {language.FloorsAvailable}
          </h2>
        </div>,
        <FloorsAndUnits floors={property.FloorsAndUnits || []} />
      ]);
    }

    let leaseAndCharges = [];
    let poi;
    if (siteType !== 'residential') {
      leaseAndCharges.push([
        <div className="row avoidPageBreak">
          <div className="col-xs-6">
            <div className="pdf_subheader">
              <h2 className="cbre_h4">
                {language.PdpLeaseInformationAndChargesTitle}
              </h2>
            </div>
          </div>
        </div>,
        <LeaseAndCharges property={property} searchType={searchType} />
      ]);
      poi = <PointsOfInterest property={property} breakpoints={breakpoints} />;
    }

    let epd;
    if (
      EnergyPerformanceData &&
      EnergyPerformanceData.type &&
      siteType !== 'residential'
    ) {
      epd = (
        <div className="row">
          <div className="col-xs-8">
            <div className="pdf_subheader">
              <h2 className="cbre_h4">
                {language.PdpEnergyPerformanceTitle}
              </h2>
            </div>
            <EnergyPerformance data={EnergyPerformanceData || {}} />
          </div>
        </div>
      );
    }

    const floorplanUrl = getPath(FloorPlans, '[0].resources[0].uri');
    const floorplan = floorplanUrl
      ? <div className="row">
          <div className="col-xs-9">
            <div className="pdf_subheader is_borderless">
              <h2 className="cbre_h4">
                {language.Floorplan}
              </h2>
            </div>
            <img className="cbre_fitWidth" src={floorplanUrl} />
          </div>
        </div>
      : null;

    const pdfFooter = renderDisclaimer
      ? (() => {
          const footer = (
            <div className="cbre_disclaimer cbre-spa--pre-line">
              {language.PdfDisclaimer}
            </div>
          );
          // Render complete so HTML is ready to output
          window.renderme = true;
          return footer;
        })()
      : null;

    const map =
      staticMaps.find(map => {
        return map.Id === `staticMap${propertyIndex}`;
      }) || {};

    return (
      <div>
        <div className="cbre_pageBreak" />
        <div className="cbre_page">
          <PdfHeader siteType={siteType} />

          <div className="main">
            <div className="pdf_body pdf_detail">
              <div className="row">
                <div className="col-xs-6">
                  {propertyImage}
                </div>

                <div className="col-xs-6">
                  <div className="pull-right cbre_icon cbre_icon_pin cbre_icon__large">
                    <span className="cbre_iconCount">
                      {letterFromIndex(propertyIndex)}
                    </span>
                  </div>

                  <div>
                    <h1 className="cbre_h1">
                      <AddressSummary address={ActualAddress} />
                    </h1>
                    <span className="cbre_subh1">
                      <PriceLabel
                        property={property}
                        searchType={searchType}
                        displayLabel={false}
                        displayStyling={false}
                      />
                    </span>
                    <span className="cbre_subh2">
                      {subh2}
                    </span>
                  </div>

                  <p className="cbre_largeText is_highlighted">
                    {language.PdfContactBlockTitle}
                  </p>

                  {this.renderContacts(property)}
                </div>
              </div>

              <div className="row">
                <div className="col-xs-6 marginTop-xs-1">
                  <h2 className="cbre_h2">
                    {StrapLine}
                  </h2>
                  {LongDescription}
                </div>

                <div className="col-xs-6">
                  <div className="pdf_subheader is_borderless">
                    <h2 className="cbre_h4">
                      {language.PdfMapTitle}
                    </h2>
                  </div>

                  <img className="staticListingsMap" src={map.Url} />
                </div>
              </div>

              {floorsAvailable}

              {sizesAndMeasurements}

              {leaseAndCharges}

              <Specification
                property={property}
                breakpoints={breakpoints}
                siteType={siteType}
              />

              {poi}

              {epd}

              {floorplan}

              <div className="row avoidPageBreak">
                <div className="col-xs-12">
                  <div className="pdf_subheader">
                    <h2 className="cbre_h4">
                      {language.PdpImagesTitle}
                    </h2>
                  </div>
                </div>
              </div>

              {this.renderPhotos(property)}
            </div>
          </div>
          {pdfFooter}
        </div>
      </div>
    );
  }
}

DetailViewPdf.contextTypes = {
  stores: PropTypes.object,
  language: PropTypes.object
};

DetailViewPdf.propTypes = {
  property: PropTypes.object.isRequired,
  siteType: PropTypes.string.isRequired,
  propertyIndex: PropTypes.number.isRequired,
  searchType: PropTypes.string.isRequired,
  staticMaps: PropTypes.array.isRequired,
  breakpoints: PropTypes.object,
  renderDisclaimer: PropTypes.bool
};

export default DetailViewPdf;