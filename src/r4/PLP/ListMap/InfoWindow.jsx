import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner";
import styled from "styled-components";
import PropertyCard_R3 from "../../../r3/PLP/PropertyCard/PropertyCard.r3";
import { currentInfoWindowPropertySelector } from "../../../redux/selectors/map/infoWindow/current-info-window-property-selector";
import {
    loadCurrentInfoWindowProperty,
    loadCurrentInfoWindowGroup
} from "../../../redux/actions/map/infoWindow/load-info-window-map-marker";
import { currentInfoWindowGroupSelector } from "../../../redux/selectors/map/infoWindow/current-info-window-group-selector";

const InfoWindowComponentR4 = props => {
    const {
        marker,
        context,
        spaPath,
        siteType,
        handleMouseOver,
        handleMouseOut,
        isMobile
    } = props;

    const infoWindowProperty = useSelector(currentInfoWindowPropertySelector);
    const infoWindowGroup = useSelector(currentInfoWindowGroupSelector);

    const [index, setIndex] = useState(0);

    const dispatch = useDispatch();

    let property;

    // check to see what kind of marker we are dealing with.  If it's a group marker, it needs to be handled differently
    if (marker && marker.key && marker.key.indexOf("group") > -1) {
        if (infoWindowGroup && infoWindowGroup.groupId === marker.key) {
            // the group has been loaded, so get the properties from it
            property = infoWindowGroup.properties;
        } else {
            // the group is not loaded, so load it
            dispatch(
                loadCurrentInfoWindowGroup(context, marker.items, marker.key)
            );
        }
    } else {
        // single property level (most likely scenario)
        if (
            infoWindowProperty &&
            infoWindowProperty.PropertyId &&
            infoWindowProperty.PropertyId === marker.property.id
        ) {
            property = infoWindowProperty;
        } else {
            dispatch(
                loadCurrentInfoWindowProperty(context, marker.property.id)
            );
        }
    }

    const topLevelEle = useRef(null); // using a ref for mouse out child descendant detection

    const mouseOver = () => {
        if (handleMouseOver) {
            handleMouseOver(marker);
        }
    };

    const mouseOut = e => {
        if (
            handleMouseOut &&
            topLevelEle &&
                topLevelEle.current &&
                !topLevelEle.current.contains(e.relatedTarget)
        ) {
            if (!Array.isArray(property)) {
                // if not a grouped property, handleMouseOUt
                handleMouseOut(marker);
            }
        }
    };

    const incrementForward = () => {
        if (index < property.length) {
            const temp = index + 1;
            setIndex(temp);
        }
    };

    const incrementBackward = () => {
        if (index !== 0) {
            const temp = index - 1;
            setIndex(temp);
        }
    };

    return (
        <InfoWindowContainer
            ref={topLevelEle}
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}
            isMobile={isMobile}
        >
            {!property && isMobile && (
                <SpinnerStyle>
                    <Spinner />
                </SpinnerStyle>
            )}
            {!property && !isMobile && <Spinner />}
            {property && !Array.isArray(property) && (
                <PropertyCard_R3
                    key={property.propertyId}
                    property={property}
                    description={true}
                    spaPath={spaPath}
                    siteType={siteType}
                    infoWindow={true}
                    forceRedirectLink={true}
                    dynamicImageSizeKey={"plpInfoWindow"}
                />
            )}
            {property && Array.isArray(property) && (
                <PcardWrapper>
                    <Header>
                        <div>
                            {index + 1} / {property.length}
                        </div>
                        <ImageContainer>
                            {index === 0 ? (
                                <img
                                    onClick={() => {}}
                                    style={{ transform: "none" }}
                                    src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/Gray-Arrow-Button.png"
                                />
                            ) : (
                                <img
                                    onClick={() => {
                                        incrementBackward();
                                    }}
                                    src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/Arrow-Button.png"
                                />
                            )}
                            {index === property.length - 1 ? (
                                <img
                                    onClick={() => {}}
                                    style={{ transform: "rotate(180deg)" }}
                                    src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/Gray-Arrow-Button.png"
                                />
                            ) : (
                                <img
                                    onClick={() => {
                                        incrementForward();
                                    }}
                                    src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/Arrow-Button.png"
                                />
                            )}
                        </ImageContainer>
                    </Header>
                    <PropertyCard_R3
                        key={property[index].propertyId}
                        property={property[index]}
                        description={true}
                        spaPath={spaPath}
                        siteType={siteType}
                        infoWindow={true}
                        forceRedirectLink={true}
                        dynamicImageSizeKey={"plpInfoWindow"}
                    />
                </PcardWrapper>
            )}
        </InfoWindowContainer>
    );
};

const PcardWrapper = styled.div`
    .gl-info-window-link-wrap div > img:nth-of-type(1) {
        top: 35px !important;
    }
`;

const SpinnerStyle = styled.div`
    margin-top: 30px;
    min-height: 40px;
    margin-bottom: -8px;
    display: flex;
`;

const Header = styled.div`
    color: #435254;
    font-size: 16px;
    font-family: "Calibre Regular";
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    position: relative;
    z-index: 1;
`;

const ImageContainer = styled.div`
    display: flex;
    > img:nth-of-type(1) {
        transform: rotate(180deg);
        margin-right: 5px;
    }
    > img {
        height: 24px !important;
        width: 24px !important;
    }
`;

const InfoWindowContainer = styled.div`
    ${props => (props.isMobile ? `width:100%;` : `max-width:261px;`)}
    background: white;
    color: black;
    cursor: pointer;
`;

export default InfoWindowComponentR4;
