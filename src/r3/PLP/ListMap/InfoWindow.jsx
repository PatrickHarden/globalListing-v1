import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-spinner';
import styled from 'styled-components';
import PropertyCard_R3 from '../PropertyCard/PropertyCard.r3';
import { currentInfoWindowPropertySelector } from '../../../redux/selectors/map/infoWindow/current-info-window-property-selector';
import { loadCurrentInfoWindowProperty, loadCurrentInfoWindowGroup } from '../../../redux/actions/map/infoWindow/load-info-window-map-marker';
import { currentInfoWindowGroupSelector } from '../../../redux/selectors/map/infoWindow/current-info-window-group-selector';

const InfoWindowComponent = (props) => {

    const { marker, context, spaPath, siteType, handleMouseOver, handleMouseOut } = props;

    const infoWindowProperty = useSelector(currentInfoWindowPropertySelector);
    const infoWindowGroup = useSelector(currentInfoWindowGroupSelector);

    const dispatch = useDispatch();

    let property;

    // check to see what kind of marker we are dealing with.  If it's a group marker, it needs to be handled differently
    if(marker && marker.key && marker.key.indexOf('group') > -1){

        if(infoWindowGroup && infoWindowGroup.groupId === marker.key){
            // the group has been loaded, so get the properties from it 
            property = infoWindowGroup.properties[0];
        }else{
            // the group is not loaded, so load it
            dispatch(loadCurrentInfoWindowGroup(context, marker.items, marker.key));
        }
    }else{
        // single property level (most likely scenario)
        if(infoWindowProperty && infoWindowProperty.PropertyId && infoWindowProperty.PropertyId === marker.property.id){
            property = infoWindowProperty;
        }else{    
            dispatch(loadCurrentInfoWindowProperty(context, marker.property.id));
        } 
    }

    const topLevelEle = useRef(null);   // using a ref for mouse out child descendant detection

    const mouseOver = () => {
        if(handleMouseOver){
            handleMouseOver(marker);
        }
    };

    const mouseOut = (e) => {
        if(handleMouseOut && (topLevelEle && topLevelEle.current && !topLevelEle.current.contains(e.relatedTarget))){
            handleMouseOut(marker);
        }
    };

    return (
       <InfoWindowContainer ref={topLevelEle} onMouseOver={mouseOver} onMouseOut={mouseOut}>
           { !property && <Spinner/> }
           { property && 
                <PropertyCard_R3
                    key={property.propertyId}
                    property={property}
                    description={true}
                    spaPath={spaPath}
                    siteType={siteType}
                    infoWindow={true}
                    dynamicImageSizeKey={'plpInfoWindow'}
                />
           }
       </InfoWindowContainer>
    ); 
};

const InfoWindowContainer = styled.div`
    background: white;
    color: black;
    cursor: pointer;
    width: 300px;
    height: 300px;
    max-width: 300px;
`;

export default InfoWindowComponent;