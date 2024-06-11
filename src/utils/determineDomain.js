export const onCbreUS = () => {
    const { hostname } = new URL(window.location);
    if(hostname && hostname.indexOf('.us') > -1){
        console.log("ON US!");
        return true;
    }
    return false;
};