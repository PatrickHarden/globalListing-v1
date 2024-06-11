import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { propertiesLoadingSelector } from "../../../redux/selectors/properties/properties-loading-selector";
import { currentPropertiesSelector } from "../../../redux/selectors/properties/current-properties-selector";
import ListViewR3 from "../../../r3/PLP/ListView/ListView.r3";
import ListViewR4 from "../../../r4/PLP/ListView/ListView.r4";
import groupObjects from "../../../utils/groupObjects";
import defaultValues from "../../../constants/DefaultValues";
import trackingEvent from "../../../utils/trackingEvent";
import { viewableMarkerCountSelector } from "../../../redux/selectors/map/markers/viewable-marker-count-selector";
import { propertiesContextSelector } from "../../../redux/selectors/properties/properties-context-selector";
import { isPrerender } from '../../../utils/browser';

const List = props => {
    const {
        context,
        listMapVariables,
        listCollapsed,
        spinAfterTransition,
        shouldTriggerScroll,
        selectedItems,
        setSelectedItems,
        setMapState,
        sortBarRef,
        modal,
        error,
        resetSearch,
        r4,
        sortChangeCallback,
        language,
        ...other
    } = props;

    // selectors
    const loading = useSelector(propertiesLoadingSelector);
    const currentProperties = useSelector(currentPropertiesSelector);
    const viewableMarkerCount = useSelector(viewableMarkerCountSelector);
    const propertiesContext = useSelector(propertiesContextSelector);

    // state
    const [sliderNr, setSlideNr] = useState(1);
    const [isGroupSlide, setIsGroupSlide] = useState(false);

    // functions
    const propertyLinkClickHandler = (coordinates, index, propertyId) => {
        const page =
            context.stores.ParamStore.getParam("page") || defaultValues.page;
        const pageSize =
            context.stores.ParamStore.getParam("pageSize") ||
            defaultValues.pageSize;
        setMapState({
            centre: {
                lat: parseFloat(coordinates.lat),
                lng: parseFloat(coordinates.lng)
            }
        });

        if (context.stores.FavouritesStore.isActive()) {
            context.stores.FavouritesStore.setIndexByPropertyId(propertyId);
        } else {
            const propertyIndex = page * pageSize - pageSize + (index + 1);
            context.actions.setPropertyIndex(propertyIndex);
        }

        const { location } = props;

        context.actions.setSearchContext({
            path: location.pathname,
            query: location.query
        });
        trackingEvent(
            "viewPropertyDetails",
            { propertyId: propertyId },
            context.stores,
            context.actions
        );
    };

    const onSliderChanged = (index, isGroupSlide) => {
        setSlideNr(index + 1);
        setIsGroupSlide(!!isGroupSlide);
    };

    const mouseOverProperty = property => {
        console.log("mouse over property");
    };

    const ListViewEmbed = r4 ? ListViewR4 : ListViewR3;

    return (
        <ListContainer loading={loading}>
            {!error && (
                <ListViewEmbed
                    key="listViewRedesign"
                    renderAsCarousel={false}
                    properties={
                        viewableMarkerCount > 0 ? currentProperties : (isPrerender ? currentProperties : [])
                    }
                    groupedProperties={
                        viewableMarkerCount > 0
                            ? groupObjects(currentProperties, "Coordinates")
                            : (isPrerender ? currentProperties : [])
                    }
                    searchType={listMapVariables.searchType}
                    spaPath={context.spaPath}
                    recaptchaKey={context.stores.ConfigStore.getItem(
                        "recaptchaKey"
                    )}
                    apiUrl={context.stores.ConfigStore.getItem(
                        "propertyContactApiUrl"
                    )}
                    language={language}
                    siteId={context.stores.ConfigStore.getItem("siteId")}
                    propertyLinkClickHandler={propertyLinkClickHandler}
                    propertyOverHandler={mouseOverProperty}
                    siteType={context.stores.ConfigStore.getItem("siteType")}
                    imageOrientation={context.stores.ConfigStore.getItem(
                        "imageOrientation"
                    )}
                    sortChangeCallback={sortChangeCallback}
                    isListCollapsed={listCollapsed}
                    spinAfterTransition={spinAfterTransition}
                    shouldTriggerScroll={shouldTriggerScroll}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    modal={modal}
                    listMapVariables={listMapVariables}
                    r4={r4}
                    favouritesIsActive={listMapVariables.favouritesIsActive}
                    sortBarRef={sortBarRef}
                    viewableMarkerCount={viewableMarkerCount}
                    onSliderChanged={onSliderChanged}
                    fullScreenSticky={listMapVariables.fullScreenSticky}
                    propertyCount={viewableMarkerCount}
                    propertiesContext={propertiesContext}
                    loading={loading}
                />
            )}
        </ListContainer>
    );
};

const ListContainer = styled.div`
    ${props =>
        props.loading &&
        `
        opacity: 0.6;
    `}
    ${window.cbreSiteTheme === "commercialr4" &&
        `background: #F5F7F7;
        transition: ease all .05s;
        .r4-list-container{
            background: #F5F7F7; 
        }
        .r4-card-loader-container{
            .card:last-child {
                border-bottom: 1px solid #bfbfbf;
            }
            .is_placeholder {
                border: 1px solid #bfbfbf;
                height: 300px;
            }            
        }
        @media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
            width: auto !important;
            overflow-x: hidden !important;
            overflow-y: scroll !important;
        }
        `}  
        .r3-card-loader-container {
        @media (min-width: 768px) {
            margin-top: 61px !important;
        }
    }
`;

export default React.memo(
    List,
    (prevState, nextState) =>
        prevState.currentProperties === nextState.currentProperties
);
