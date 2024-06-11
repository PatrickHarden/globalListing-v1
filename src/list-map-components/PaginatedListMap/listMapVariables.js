// util functions
const ieVersion = () => {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > -1)
        return 11;
    else if (ua.indexOf("Trident/6.0") > -1)
        return 10;
    else if (ua.indexOf("Trident/5.0") > -1)
        return 9;
    else
        return 0;  // not IE9, 10 or 11
};

// returns a common set of variables used to setup the listmap page
export const getListMapVariables = (context, breakpoints, activeTab, listCollapsed) => {

    const features = context.stores.ConfigStore.getItem('features');

    const isMobileMap = breakpoints.isMobile && activeTab === 'map';

    // determine search type
    let searchType = context.stores.SearchStateStore.getItem('searchType');
    let searchTypeString = searchTypeExtended === 'isSaleLetting' ? context.language['saleLetSearchType'] : null;
    // searchTypeExtended is the same as searchType except it has 'isSaleLetting' as an option as well rather than defaulting to 'isSale'
    const searchTypeExtended = context.stores.SearchStateStore.getItem('searchTypeExtended');
    if (!searchTypeString || searchTypeString.trim().length == 0) {
        searchTypeString = searchTypeExtended === 'isLetting'
            ? context.language['letSearchType']
            : context.language['saleSearchType']; 
    }
    if(features.enableSearchType){
        if(window.location.href.includes('aspects')){
            searchType = context.stores.ParamStore.getParam("aspects");
        }         
        searchTypeString = searchType? context.language[searchType+'SearchType'] : null;
    }

    // favorites active
    let favouritesIsActive = false;
    const params = context.stores.ParamStore.getParams();
    if(params.isFavourites && params.isFavourites === 'true' || params.isFavourites === true){
        favouritesIsActive = true;
    }

    // breadcrumb
    const breadcrumb = context.stores.ConfigStore.getItem('breadcrumbPrefix');
    let showBreadcrumb = breadcrumb && breadcrumb.length;
    if (features.hideBreadcrumbOnPLP){
        showBreadcrumb = false;
    }

    const listMapVariables = {
        features: features,
        isMobile: breakpoints.isMobile,
        isTabletAndUp: breakpoints.isTabletAndUp,
        fullScreenSticky: (features.plpFullScreenSticky && breakpoints.isTabletAndUp && ieVersion() == 0) ? true : false,
        mapState: context.stores.SearchStateStore.getItem('mapState') || {},
        searchType: searchType,
        searchTypeString: searchTypeString,
        sideBarClass: breakpoints.isTabletAndUp ? 'cbre_sidebar' : '',
        hideSortClass: breakpoints.isMobile && activeTab === 'map' ? 'is-hidden' : '',
        isMobileMap: isMobileMap,
        carouselClass: isMobileMap ? 'carousel' : '',
        sideBarCollapsedClass: !breakpoints.isMobile && breakpoints.isTabletLandscapeAndUp && !listCollapsed ? 'is_wide' : 'is_narrow',
        renderCarousel: !breakpoints.isMobile && activeTab === 'map',
        favouritesIsActive: favouritesIsActive,
        showBreadcrumb: showBreadcrumb
    }
    return listMapVariables;
}

