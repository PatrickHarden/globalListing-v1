import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import getFormattedString from '../../utils/getFormattedString';
import formatArea from '../../utils/getFormattedArea';
import { PhotoSwipe } from 'react-photoswipe';
import getAvailability from '../../utils/getAvailability'


const iconsR3 = {
    floorplan:'floorplanicon3.png',
    brochure:'brochureicon3.png',
    threed:'3dwalkthrough.png',
    video:'video.png',
    isLetting:'/resources/images/GL-Icons/lease.png',
    isSale:'/resources/images/GL-Icons/sale.png'

}

const iconsR4 = {
    floorplan:'r4_floorplan.png',
    brochure:'r4_brochure.png',
    threed:'r4_3dwalkthrough.png',
    video:'r4_video.png',
    isLetting:'/resources/images/GL-Icons/r4-lease.png',
    isSale:'/resources/images/GL-Icons/r4-sale.png'
}
class SpaceLevelDisplay extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            hideSpaceDetails: props.hideSpaceDetails,
            icons : props.theme ==='r4'? iconsR4:iconsR3,
            isOpen:false,
            index:0
        };

        this.getLeasePricemarkUp = this.getLeasePricemarkUp.bind(this);
        this.getSalePriceMarkUp = this.getSalePriceMarkUp.bind(this);
        this.renderAvailableFrom = this.renderAvailableFrom.bind(this);
        this.renderFloorPlans = this.renderFloorPlans.bind(this);
        this.renderSizes = this.renderSizes.bind(this);
    }

    componentDidMount(){
        let floorPlans = this.getFloorPlans(this.props.property);
        if(floorPlans&&floorPlans.length>0){
        this.setState({ floorPlans, lightboxData:floorPlans[0].lightboxData});
        }
    }


    getThumbNail(resource) {

        try {
            const reverseProxyRelativePath = resource.uri.split("/resources/")[1];
            const absoluteStartingPath = resource.sourceUri.split("/fileassets/")[0];
            return `${absoluteStartingPath}/${reverseProxyRelativePath}`;
        }
        catch (e) {
            return resource.uri;
        }
    }




    getTitle(subdivisionName, culture) {
        if (typeof subdivisionName === 'string') {
            return subdivisionName;
        } else {
            let subDivision = subdivisionName.filter((subDivision => subDivision.culture.toLowerCase() === culture));

            if (subDivision && subDivision.length > 0) {
                return subDivision[0].text;
            } else {
                return subdivisionName[0].text;
            }
        }

    }


    getFormattedArea = (unitSize) => {
        let culture = this.props.culture.toLowerCase();
        let { language } = this.context;
        let area = unitSize.area && unitSize.area!==0 ? formatArea(
            culture,
            unitSize.units,
            unitSize.area,
            language,
            true,
            2
        ): null;

        if (unitSize.minArea && unitSize.maxArea) {
            let minArea = formatArea(
                culture,
                unitSize.units,
                unitSize.area,
                language,
                false,
                2
            );
            let maxArea = formatArea(
                culture,
                unitSize.units,
                unitSize.area,
                language,
                false,
                2
            );
            area = getFormattedString({ minimumSize: minArea, totalSize: maxArea, unit: unitSize.units }, language['PropertySizeRange']);
        }
        return area;
    }
    getFloorPlans = ({ FloorsAndUnits }) => {
        let {stores} = this.context;
        let cdnUrl = stores.ConfigStore.getItem('cdnUrl');
        let culture = this.props.culture.toLowerCase();
      
        return FloorsAndUnits.map((floor) => {

            let title = this.getTitle(floor.subdivisionName, culture);
            let lightboxData = [];
            let photos = [];
    
            let { use, availableFrom, leaseType, status, unitCharges, unitWalkthrough,availability } = floor;

            let floorPlans = [];
            let sizes = [];
            let videoLink = floor.videoLinks && floor.videoLinks.length > 0 ? floor.videoLinks[0].uri : null;


            let brochure = floor.brochure.content;
            let spaceDescription = floor.spaceDescription.content;

            floor.unitPhotos.forEach(photo => {
                let fullSize, thumbnail;
                photo.resources.forEach(resource => {
                    if (resource.breakpoint.toLowerCase() === 'original') {
                        fullSize = resource.sourceUri;
                    }

                    if (resource.breakpoint.toLowerCase() === 'large') {
                        let lightboxPhoto = {};
                        // Build Photoswipe object.
                        lightboxPhoto['src'] = cdnUrl + resource.uri;
                        lightboxPhoto['w'] = resource.width;
                        lightboxPhoto['h'] = resource.height;
                        lightboxPhoto['title'] = photo.caption;
                        lightboxPhoto['dataType'] = 'photo'; // Used as a key for indexing.

                        // Merge items.
                        lightboxData.push(lightboxPhoto);
                        
                    }
                    if (resource.breakpoint.toLowerCase() === 'small') {
                        thumbnail = this.getThumbNail(resource);
                    }
                })
                photos.push({ fullSize, thumbnail });
    
            })

            floor.floorPlans.forEach(floorPlan => {
                floorPlan.imageResources.forEach(resource => {
                    floorPlans.push(resource.uri)
                    if(resource.uri.indexOf('.pdf') === -1){
                        let lightboxFloorplan = {};
                        lightboxFloorplan['src'] =  cdnUrl+resource.uri;
                        lightboxFloorplan['w'] = resource.width;
                        lightboxFloorplan['h'] = resource.height;
                        lightboxFloorplan['title'] = floorPlan.caption;
                        lightboxFloorplan['dataType'] = 'floorplan'; // Used as a key for indexing.
                        lightboxData.push(lightboxFloorplan);
                    }
                })
            })
            floor.sizes.forEach(size => {
                sizes.push({ sizekind: size.sizeKind, units: size.dimensions.units, area: size.dimensions.area });
            })

            return { area:this.getFormattedArea(floor.unitSize), title, use, availableFrom, availability, leaseType, status, brochure, unitCharges, spaceDescription, unitWalkthrough, videoLink, floorPlans, photos, sizes,lightboxData };
        })
    }

    toggleSpaceLevelDisplay = () => {
        this.setState({ hideSpaceDetails: !this.state.hideSpaceDetails });
    }


    getSalePriceMarkUp(charges) {
        const {stores } = this.context;
        const features = stores.ConfigStore.getItem('features');

        let salePrice = charges.filter(charge => charge.chargeType.toLowerCase() === 'saleprice');

        if (salePrice && salePrice.length > 0) {
            let charge = salePrice[0];
            if (charge.amount === '' || charge.amount == null || charge.amount===0) { return null; }
            const amount = parseFloat(charge.amount);
            const numberFormatTranslated = new Intl.NumberFormat(features.sizeCultureCode? features.sizeCultureCode : this.props.culture, {
                style: 'currency',
                currency: charge.currencyCode,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });


            return (<div className="priceWrapper">
                <div width="50px" className="pricingTd">
                    <img src={this.generatePricingImg('isSale')} className="pricingImg" />
                </div>
                <div className="pricingTd">
                    <div className="pricingText"  data-test="dataTestSalePrice">{numberFormatTranslated.format(amount)}</div>
                </div>
            </div>)
        } else {
            return null;
        }
    }

    generatePricingImg = (aspect) => {
        const { stores } = this.context;
        const {icons} = this.state;
        // get aspect type images from config store, if image for aspect type exist return it else send deafult images
        const aspectTypeImages = stores.ConfigStore.getItem('aspectTypeImages');
        let pricingImg = aspectTypeImages ? aspectTypeImages[aspect] : null;

        if (pricingImg) {
            return pricingImg;
        }

        if (aspect == 'isLetting') {
            pricingImg = icons['isLetting'];
        } else if (aspect == 'isSale') {
            pricingImg = icons['isSale'];
        }
        return pricingImg;
    };

    
    getLeasePricemarkUp(charges) {
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');

        let leasePrice = charges.filter(charge => charge.chargeType.toLowerCase() === 'rent');
        if (leasePrice && leasePrice.length > 0) {
            let minCharge = leasePrice[0];
            if (minCharge.amount === '' || minCharge.amount === null || minCharge.amount === 0) { return null; }
            const minAmount = parseFloat(minCharge.amount);

            const culture = features.sizeCultureCode? features.sizeCultureCode : this.props.culture;
            const numberFormatTranslated = new Intl.NumberFormat(culture, {
                style: 'currency',
                currency: minCharge.currencyCode,
                minimumFractionDigits:2,
                maximumFractionDigits: 2
            });

            let translatedUnit = language[leasePrice[0].unit] || leasePrice[0].unit || '';
            let translatedInterval = language[leasePrice[0].interval] || leasePrice[0].interval || '';
            if(features && features.ignoreWholeUnit && translatedUnit && translatedUnit.toLowerCase() === "whole") {
                translatedUnit = "";
            }

            let minPrice = numberFormatTranslated.format(minAmount);
            // Manually fix currency issue for Denmark because react-intl v2.4 couldn't return property format 
            if (culture && culture === 'da-dk')
            {
                minPrice = "Kr. " + minPrice.replace(/\s/g, '').replace('kr.', '');
            }

            leasePrice = translatedUnit ? `${minPrice}/${translatedUnit}/${translatedInterval}`: `${minPrice}/${translatedInterval}`;

            return (
                <div className="priceWrapper">
                    {!features.hideLeaseType && <div width="50px" className="pricingTd" >
                        <img src={this.generatePricingImg('isLetting')} className="pricingImg" />
                    </div>
                    }
                    <div className="pricingTd">
                        <div className="pricingText"  data-test="dataTestLeasePrice">{leasePrice}</div>
                    </div>
                </div>
            )
        } else {
            return null;
        }

    }

    renderAvailableFrom(floor) {
        const { language } = this.context;
        const siteId = this.context.stores.ConfigStore.getItem('siteId');
        if (siteId.toLowerCase() === "de-comm") {
            let availability = getAvailability(floor, this.context);
            return (<div className="AvailableStatusLeaseItem">
                <p className="DataLabelLabelSpaceLevelDisplay mb-zero">
                    {language && language.AvailableFrom ? language.AvailableFrom : "Available From"}
                </p>
                <p
                    className="DataLabelContentSpaceLevelDisplay"
                    data-test="dataTestAvailableFrom">
                    {availability.value}
                </p>
            </div>)
        } else {
            const availableFrom = floor.availableFrom;
            if (availableFrom === '' || availableFrom === null) return null;
            let available;
            try {
                available = new Date(availableFrom + ' 00:00');     // the ' 00:00' is required to avoid conversion to UTC
            }
            catch (e) {
                console.log(e);
            }

            // If "available from" date is in the past, don't show it (pass string.empty);
            if (available < new Date()) {
                return null;
            }
            try {
                if (available) {
                    return (
                        <div className="AvailableStatusLeaseItem">
                            <p className="DataLabelLabelSpaceLevelDisplay mb-zero"  >{language['SpaceAvailableFrom'] || 'Available From'}</p>
                            <p className="DataLabelContentSpaceLevelDisplay" data-test="dataTestAvailableFrom">{new Intl.DateTimeFormat(this.props.culture).format(available)}</p>
                        </div>);
                }
            } catch (e) {
                return <div>&nbsp;</div>;
            }
        }
    }

    renderImagesMarkUp(photos,floorIndex) {

        if (!photos || photos.length === 0) { return null }
        let firstPhotoMarkUp =  <img onClick={()=>{this.openLightbox(0,floorIndex)}}  src={photos[0].thumbnail} className={'spaceLevelImageExtra '+ (photos.length >1 ? 'spaceLevelImageFirst' : 'mr-zero')} />
        let secondPhotomarkUp;
        if (photos.length === 2) {
            secondPhotomarkUp = <img onClick={()=>{this.openLightbox(1,floorIndex)}}  src={photos[1].thumbnail} className='spaceLevelImageExtra mr-zero' />
        } else if (photos.length > 2) {
            secondPhotomarkUp =
                <div className="image-containerSpaceLevelDisplay" onClick={()=>{this.openLightbox(1,floorIndex)}}>
                    
                        <img src={photos[1].thumbnail} className="spaceLevelImageExtra" />
                        <div className="overlaySpaceLevelDisplay">
                            <div className="imageOverlayText">
                                + {photos.length - 2}
                            </div>
                        </div>
                </div>
        }
        return (
            <div className="ImagesContainerSpaceLevelDisplay" >
                {firstPhotoMarkUp}
                {secondPhotomarkUp}
            </div>
        )
    }


    
    openLightbox = (index,floorIndex) => {
        this.setState({
            isOpen: true,
            index: index,
            floorIndex:floorIndex,
            lightboxData:this.state.floorPlans[floorIndex].lightboxData
        });
    };

    openFloorPlan = (floorIndex) => {
        this.setState({
            isOpen: true,
            index: this.state.floorPlans[floorIndex].photos?this.state.floorPlans[floorIndex].photos.length : 0,
            floorIndex:floorIndex,
            lightboxData:this.state.floorPlans[floorIndex].lightboxData
        });
    };



    closeLightbox = () => {
        this.setState({
            isOpen: false,
            index: 0
        });
    };

    renderSizes(sizes) {
        const { language } = this.context;
        let filterSizes = sizes.filter(size => (size.sizekind === 'MezzanineSize' || size.sizekind === 'WarehouseSize' || size.sizekind === 'OfficeSize'));
        return filterSizes.map((size,i) => {
            let area = formatArea(
                this.props.culture,
                size.units,
                size.area,
                language,
                true,
                2
            )
            return (
                <div className="AvailableStatusLeaseItem" key={'area-'+i}>
                    <p className="DataLabelLabelSpaceLevelDisplay mb-zero" >{language[size.sizekind] || size.sizekind}</p>
                    <p className="DataLabelContentSpaceLevelDisplay">{area}</p>
                </div>
            )
        })
    }

    renderFloorPlans(floorPlans,icon,floorIndex) {
        if (!floorPlans || floorPlans.length === 0) return null;
        const { language } = context;
        let pdfPlan = floorPlans.filter(floorPlan => floorPlan.indexOf('.pdf') !== -1);
        let target = '';
        let plan = floorPlans[0];

        if (pdfPlan && pdfPlan.length > 0) {
            target = '_blank';
            plan = pdfPlan[0];
        }

        let markUp = <React.Fragment>
             <img src={"/resources/images/GL-Icons/"+icon} className="spaceLevelLinkImage" />
                <p className="spaceLevelLinkText" data-test="test-floor-plan">
                    {language['Floorplan'] || 'Floor Plan'}
                </p>
        </React.Fragment>
        
        return  pdfPlan && pdfPlan.length > 0 ? (<div className="SpaceLevelItemLinks" >
            <a href={plan} target={target}>
               {markUp}
            </a>
        </div>) :(<div className="SpaceLevelItemLinks" onClick={()=>{this.openFloorPlan(floorIndex)}}>
               {markUp}
            
        </div>)

    }

    getCurrencyCode = ({ Charges }) => {
        return Charges && Charges.length > 0 ? Charges.filter(charge => charge.currencyCode != null & charge.currencyCode != '')[0].currencyCode : ''
    }
    renderTopBar = () => {
        const { language,stores } = this.context;
        const features=stores.ConfigStore.getItem('features');
        let header = language['SpacesAvailable'] || 'Spaces Available';
        const numberOfFloors = this.state.floorPlans.length;
        if(this.props.culture.toLowerCase()==='en-in'){
          header=  numberOfFloors === 1 ? `${numberOfFloors} Unit Available` : `${numberOfFloors} Units Available`
        }


        return (
            <div className="masterSpaceLevelContainer">
                 <div className="containerTopBar">
                    <h2 className="HeaderSpaceLevelDisplay HeaderBoldFont" data-test="pdp-space-header">{header}</h2>
                    {<div className="float-right">
                        <button type="button" className="ToggleButtonSpaceLevelDisplay DesktopToggleButton" id="toggleButtonSpaceLevelDisplay" onClick={this.toggleSpaceLevelDisplay} data-test="pdp-space-toggleButton">
                            {!this.state.hideSpaceDetails ? (language['HideSpaceDetails'] || 'Hide Space Details') : (language['ShowSpaceDetails'] || 'Show Space Details')}
                        </button>
                        <button type="button" className="ToggleButtonSpaceLevelDisplay MobileToggleButton" onClick={this.toggleSpaceLevelDisplay} data-test="pdp-space-toggleButtonMobile">
                            <img src={'/resources/images/GL-Icons/' + (this.state.hideSpaceDetails ? 'ArrowDown.png' : 'ArrowUp.png')} className="toggle-icon" id="SpaceLevelMobileToggleButton" />
                        </button>
                    </div>
                    }
                 </div>                
            </div>)
    }

    renderLightbox = () => {
        const { isOpen, index,lightboxData } = this.state;
      
        return (
             <PhotoSwipe
                ref="lightbox"
                isOpen={isOpen }
                items={lightboxData}
                options={{
                    index,
                    closeOnScroll: false,
                    history: false
                }}
                onClose={this.closeLightbox}
                gettingData={this.imageDimensionCheck}
            />
        );
    };


    imageDimensionCheck = (lightbox, index) => {
        const item = lightbox.getItemAt(index);
        if (item.w < 1 || item.h < 1) {
            var img = new Image();
            img.onload = function () {
                item.w = this.width;
                item.h = this.height;
                lightbox.invalidateCurrItems();
                lightbox.updateSize(true);
            };
            img.src = item.src;
        }
    }

    render() {
        const { language,stores } = this.context;
        const features=stores.ConfigStore.getItem('features');
        const { property } = this.props;
        const icons = this.state.icons;
        let floorPlans = this.state.floorPlans;
        if (!floorPlans || floorPlans.length === 0) {
            return null;
        }
        return (
            <React.Fragment>
                <div className="LineSpaceLevelDisplayTop"></div>
                {this.renderTopBar()}
                <div className="spacesContainer mx-20" >
                    {floorPlans.map((floor, i) => {
                        let leaseMarkUp = this.getLeasePricemarkUp(floor.unitCharges);
                        let saleMarkUp = this.getSalePriceMarkUp(floor.unitCharges);
                      //  const lineHeightForInfo = leaseMarkUp && saleMarkUp ? 'lineHeight56' :'lineHeight40';
                        return (
                            <React.Fragment key={'floor-' + i}>
                                <div className= {"collapsibleSpaceLevelDisplay " + (this.state.hideSpaceDetails ? 'collapsed':'')} >

                                    {(floor.title && floor.title.trim()) && <div className='TitleSpaceLevelDisplay'>{floor.title}</div>}
                                    <div className="spaceAreaType " >
                                       <div className="HeaderInfoSpaceLevelDisplay ">{floor.area}</div>
                                       <div className="HeaderInfoSpaceLevelDisplay ">{language[floor.use] || floor.use}</div>
                                       { <div className={"pricingContainer"+ (leaseMarkUp || saleMarkUp ? "pb-10":'')}>
                                           
                                                {
                                                   leaseMarkUp
                                                }
                                                {
                                                    saleMarkUp
                                                }
                                         
                                        </div>
                    }
                                    </div>
                                </div>
                                {!this.state.hideSpaceDetails && <div className="contentSpaceLevelDisplay" >
                                    <div className="AvailableStatusLeaseContainer">
                                        {this.renderAvailableFrom(floor)}
                                        {!features.hideSpaceAvailabilityStatus && floor.status &&
                                            (
                                                <div className="AvailableStatusLeaseItem">
                                                    <p className="DataLabelLabelSpaceLevelDisplay mb-zero" >{language['status'] || 'Status'}</p>
                                                    <p className="DataLabelContentSpaceLevelDisplay">{language[floor.status]}</p>
                                                </div>
                                            )
                                        }

                                        {floor.leaseType &&
                                            <div className="AvailableStatusLeaseItem">
                                                <p className="DataLabelLabelSpaceLevelDisplay mb-zero" >{language['leaseType'] || 'Lease Type'}</p>
                                                <p className="DataLabelContentSpaceLevelDisplay">{language[floor.leaseType] || floor.leaseType}</p>
                                            </div>
                                        }

                                        {this.renderSizes(floor.sizes)}

                                    </div>
                                    {this.renderImagesMarkUp(floor.photos,i)}

                                  {floor.spaceDescription && floor.spaceDescription.trim() && <div className="CopySpaceLevelDisplay">
                                        <p className="spaceDescription" id="spaceDescription" data-test={floor.spaceDescription}>
                                            {floor.spaceDescription}
                                        </p>
                                    </div>}
                                    {((floor.floorPlans && floor.floorPlans.length > 0)
                                        || floor.brochure || floor.unitWalkthrough || floor.videoLink
                                     ) && <div className="FloorBrochureContainerSpaceLevelDisplay">
                                            {this.renderFloorPlans(floor.floorPlans,icons.floorplan,i)}

                                            {floor.brochure && <div className="SpaceLevelItemLinks">
                                                <a target="_blank" href={floor.brochure}>
                                                    <img src={"/resources/images/GL-Icons/"+icons.brochure} className="spaceLevelLinkImage" />
                                                </a>
                                                <p className="spaceLevelLinkText">
                                                    <a target="_blank" href={floor.brochure} className="color-links" data-test="dataTestBrochure">
                                                        {language['Brochure'] || 'Brochure'}
                                                    </a>
                                                </p>
                                            </div>}

                                            {floor.unitWalkthrough &&
                                                <div className="SpaceLevelItemLinks">
                                                    <a target="_blank" href={floor.unitWalkthrough}>
                                                        <img src={"/resources/images/GL-Icons/"+icons.threed} className="spaceLevelLinkImage" />
                                                    </a>
                                                    <p className="spaceLevelLinkText">
                                                        <a target="_blank" href={floor.unitWalkthrough} className="color-links">
                                                            {language['InteractiveFloorPlan'] || 'Interactive Floor Plan'}
                                                        </a>
                                                    </p>
                                                </div>
                                            }

                                            {floor.videoLink &&
                                                <div className="SpaceLevelItemLinks mr-0" >
                                                    <a target="_blank" href={floor.videoLink}>
                                                        <img src={"/resources/images/GL-Icons/"+icons.video}  className="spaceLevelLinkImage" />
                                                    </a>
                                                    <p className="spaceLevelLinkText">
                                                        <a target="_blank" href={floor.videoLink} className="color-links">
                                                            {language['Video'] || 'Video'}
                                                        </a>
                                                    </p>
                                                </div>
                                            }

                                            

                                        </div>
                                    }
                                </div>
                                }
                                 
                            </React.Fragment>
                        )
                    })

                    }
                </div>
                <div className="LineSpaceLevelDisplay"></div>
                { this.renderLightbox()}
            </React.Fragment>
        )
    }


}
SpaceLevelDisplay.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

export default SpaceLevelDisplay