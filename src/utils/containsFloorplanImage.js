export const containsFloorplanImage = (floorplans) => {
    let containsImage = false;
    if(floorplans && Array.isArray(floorplans)){
        floorplans.forEach(floorplan => {
            if(floorplan && floorplan.resources && floorplan.resources.length > 0 && floorplan.resources[0].uri 
                && floorplan.resources[0].uri.substring(floorplan.resources[0].uri.lastIndexOf('.') + 1) !== 'pdf'){
                    containsImage = true;
            }
        });
    }
    return containsImage;
};