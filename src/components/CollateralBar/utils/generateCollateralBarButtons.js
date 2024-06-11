import LayersIcon from '@mui/icons-material/Layers';            // floorplans
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';    // 3d floorplan
import MenuBookIcon from '@mui/icons-material/MenuBook';  // brochure
import LinkIcon from '@mui/icons-material/Link';  // website link
import MapIcon from '@mui/icons-material/Map';  // map
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'; // videos

/*
- type: anchor, link, dropdown, lightbox
- icon (optional): pass in a reference to an MUI 
    - component : reference to the MUI component
    - alt: the alt tag for the icon
- label (required): string
- alt (optional): string - the alt tag for the container
- target: (mimics href target) _blank, _self
- anchor: string - if it's an anchor tag, this is the anchor tag to use
- link: string - the url to link to (for 'link' & 'lightbox' types)
- items: for "dropdown" type, will be a list of additional assets for the dropdown using the same data model
*/

const createBrochureLink = (brochure, labelOverride) => {
    return {
        type: 'link',
        icon: {
            component: MenuBookIcon,
            alt: labelOverride ? labelOverride : brochure.brochureName
        },
        label: labelOverride ? labelOverride : brochure.brochureName,
        alt: labelOverride ? labelOverride : brochure.brochureName,
        target: '_blank',
        link: brochure.uri
    };
};

const createFloorLink = (floor, labelOverride) => {
    let fileType = floor && floor.resources[0] && floor.resources[0].uri && floor.resources[0].uri.split('.').pop() || '';
    if (fileType.toLowerCase() === 'pdf') {
        return {
            type: 'link',
            icon: {
                component: MenuBookIcon,
                alt: labelOverride ? labelOverride : floor.caption
            },
            label: labelOverride ? labelOverride : floor.caption,
            alt: labelOverride ? labelOverride : floor.caption,
            target: '_blank',
            link: floor.resources[0].uri
        };
    } else {
        return {
            type: 'lightbox',
            link: floor.resources[0].uri,
            icon: {
                component: LayersIcon,
                alt: labelOverride ? labelOverride : floor.caption
            },
            label: labelOverride ? labelOverride : floor.caption,
            alt: labelOverride ? labelOverride : floor.caption
        };
    }
};

const createVideoLink = (video, labelOverride) => {
    return {
        type: 'link',
        icon: {
            component: VideoLibraryIcon,
            alt: labelOverride ? labelOverride : video.videoName
        },
        label: labelOverride ? labelOverride : video.videoName,
        alt: labelOverride ? labelOverride : video.videoName,
        target: '_blank',
        link: video.uri
    };
};

const createWebsiteLink = (label, url) => {
    return {
        type: 'link',
        icon: {
            component: LinkIcon,
            alt: label
        },
        label: label,
        alt: label,
        target: '_blank',
        link: url
    };
};

const generateLabel = (items, singular, plural, singularBackup, pluralBackup) => {
    return items && items.length > 1 ? plural || pluralBackup : singular || singularBackup; 
};

export const generateCollateralBarButtons = (property, language) => {

    // this is pretty static right now, we generate the assets based on specific data points passed to the property
    // based on figma designs as of 2/15/2022

    const collateralBarButtons = [];

    // floorplans - they can be links to files or images(open in lighbox)
    if (property && property.FloorPlans && property.FloorPlans.length > 0) {
        const floorplansLabel = generateLabel(property.FloorPlans, language.PdpViewFloorplanButtonText,
            language.PdpViewFloorplanPluralButtonText ? language.PdpViewFloorplanPluralButtonText : language.PdpViewFloorplanButtonText + 's',
            'Floorplan', 'Floorplans');
        if (property && property.FloorPlans && property.FloorPlans.length > 1) {
            collateralBarButtons.push({
                type: 'dropdown',
                icon: {
                    component: LayersIcon,
                    alt: floorplansLabel
                },
                label: floorplansLabel,
                alt: floorplansLabel,
                items: property.FloorPlans.map((floorPlan,i) => {
                    return createFloorLink(floorPlan, language.PdpViewFloorplanOptionText || 'Floor Plan ' + (i+1));
                })
            });
        } else {
            let fileType = property.FloorPlans[0].resources[0].uri && property.FloorPlans[0].resources[0].uri.split('.').pop() || '';
            if (fileType.toLowerCase() === 'pdf') {
                collateralBarButtons.push({
                    type: 'link',
                    icon: {
                        component: LayersIcon,
                        alt: floorplansLabel
                    },
                    label: floorplansLabel,
                    alt: floorplansLabel,
                    target: '_blank',
                    link: property.FloorPlans[0].resources[0].uri
                });
            } else {
                collateralBarButtons.push({
                    type: 'lightbox',
                    link: property.FloorPlans[0].resources[0].uri,
                    icon: {
                        component: LayersIcon,
                        alt: floorplansLabel
                    },
                    label: floorplansLabel,
                    alt: floorplansLabel
                });
            }
        }
    }

    // 3d interactive floorplan (walkthrough)
    if(property && property.Walkthrough && property.Walkthrough.length > 0){
        const interactiveFloorplanLabel = language.PdpViewInteractiveplanButtonText || '3D Interactive FloorplanX';
        collateralBarButtons.push({
            type: 'link',
            icon: {
                component: ThreeDRotationIcon,
                alt: interactiveFloorplanLabel
            },
            label: interactiveFloorplanLabel,
            alt: interactiveFloorplanLabel,
            target: '_blank',
            link: property.Walkthrough
        });
    }

    // brochures - brochures are links to files instead of an anchor
    if(property && property.Brochures && property.Brochures.length > 0){
        let brochureBarButton;
        let brochuresLabel = generateLabel(property.Brochures, language.PdpDownloadBrochureButtonText, language.PdpDownloadBrochureButtonText + 's', 'BrochureX', 'BrochuresX');
        if(property.Brochures.length > 1) {
            brochureBarButton = {
                type: 'dropdown',
                icon: {
                    component: MenuBookIcon,
                    alt: brochuresLabel
                },
                label: brochuresLabel,
                alt: brochuresLabel,
                items: property.Brochures.map(brochure => {
                    return createBrochureLink(brochure, undefined);
                })
            };
            // we'll need to make it a dropdown with multiple items
        }else{
            // if it's just one brochure, we will just make it a single link
            brochureBarButton = createBrochureLink(property.Brochures[0], brochuresLabel);
        }
        collateralBarButtons.push(brochureBarButton);
    }

    // videos
    if(property && property.VideoLinks && property.VideoLinks.length > 0){
        let videoBarButton;
        let videoBarButtonLabel = generateLabel(property.VideoLinks, language.PdpViewVideoLinksButtonText, language.PdpViewVideoLinksButtonText + 's', 'Video', 'Videos');
        if(property.VideoLinks.length > 1) {
            videoBarButton = {
                type: 'dropdown',
                icon: {
                    component: VideoLibraryIcon,
                    alt: videoBarButtonLabel
                },
                label: videoBarButtonLabel,
                alt: videoBarButtonLabel,
                items: property.VideoLinks.map(video => {
                    return createVideoLink(video, undefined);
                })
            };
            // we'll need to make it a dropdown with multiple items
        }else{
            // if it's just one brochure, we will just make it a single link
            videoBarButton = createVideoLink(property.VideoLinks[0], videoBarButtonLabel);
        }
        collateralBarButtons.push(videoBarButton);
    }

    // rainfall data
    if(property && property.Links && property.Links.filter((link) => {return link.urlType === 'RainFallDataURL';}).length > 0){
        const rainfallArr = property.Links.filter((link) => { return link.urlType === 'RainFallDataURL';});
        let rainfallBarButton;
        let rainfallBarButtonLabel = generateLabel(property.Links, language.PdpViewViewPropertyWebsiteText, language.PdpViewViewPropertyWebsiteText, 'Monthly Rainfall Data', 'Monthly Rainfall Data');
        if(rainfallArr.length > 1){     // shouldn't happen, but just in case
            rainfallBarButton = {
                type: 'dropdown',
                icon: {
                    component: LinkIcon,
                    alt: rainfallBarButtonLabel
                },
                label: rainfallBarButtonLabel,
                alt: rainfallBarButtonLabel,
                items: rainfallArr.map((link,index) => {
                    return createWebsiteLink(rainfallBarButtonLabel + ' ' + index, link.url);
                })
            };
        }else{
            rainfallBarButton = createWebsiteLink(rainfallBarButtonLabel, rainfallArr[0].url);
        }
        collateralBarButtons.push(rainfallBarButton);
    }

    // property website
    if(property && property.Website && property.Website.length > 0){
        const websiteLabel = language.PdpViewViewPropertyWebsiteText || 'Property Website';
        collateralBarButtons.push(createWebsiteLink(websiteLabel, property.Website));
    }
    
    // map
    if(property && property.Coordinates && property.Coordinates.lat && property.Coordinates.lon){
        const mapLabel = language.MapViewTabText || 'MapX';
        collateralBarButtons.push({
            type: 'anchor',
            anchor: '#pdp-map-bookmark',
            icon: {
                component: MapIcon,
                alt: mapLabel
            },
            label: mapLabel,
            alt: mapLabel
        });
    }

    return collateralBarButtons;
};