module.exports = {
    radius: 'radius',
    lat: 'Lat',
    lng: 'Lon',
    polygons: 'PolygonFilters',
    aspects: 'Common.Aspects',
    pagesize: 'PageSize',
    page: 'Page',
    sort: 'Sort',
    propertyId: 'Common.PrimaryKey',
    parentProperty: 'Common.ParentProperty',
    propertySubType: 'Common.PropertySubType',
    usageType: 'Common.UsageType',
    isParent: 'Common.IsParent',
    broker: 'Common.ContactGroup.Common.Contacts.Common.EmailAddress',
    groupType: "Common.ContactGroup.Common.GroupType",

    // These params will be stripped from outgoing calls to the API
    // Internal usage
    placeId: false,
    location: false,
    searchMode: false,
    view: false,
    isFavourites: false,
    _pdfrender: false,
    spaVersion: false,

    // PropertyTypes is no longer supported
    propertyTypes: false,
    

    // Google adwords
    gclid: false,
    fbclid: false,
    utm_source: false, 
    utm_content: false, 
    utm_medium: false, 
    utm_campaign: false,
    li_fat_id: false
};
