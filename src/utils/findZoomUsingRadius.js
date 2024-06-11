export const getZoomUsingRadius = (radius) => {
    //basic now...we could probably try to smarten this up later
    
    radius = Number.parseFloat(radius);

    if(radius <= 1){
        return 12;
    }else if(radius > 1 && radius < 50){
        return 10;
    }else if(radius > 50 && radius < 250){
        return 8;
    }
    return 6;
};