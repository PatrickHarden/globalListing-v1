export default (culture, units, area, language, includeUnits = true, maxDecimals = 0) => {
    // let maxDecimals = 0;
    switch (units) {
        case 'acre':
        case 'hectare':
        case 'acres':
        case 'hectares':
            maxDecimals = 2;
            break;
        default:
            // maxDecimals = 0;
            break;
    }
    let cultureCode = culture;
    if (cultureCode.toLowerCase() === 'pl-pl') {
        cultureCode = 'en-pl'
    }
    else if (cultureCode.toLowerCase() === 'es-es') {
        cultureCode = 'de-DE'
    }
    else if (cultureCode.toLowerCase() === 'de-at') {
        cultureCode = 'de-DE'
        maxDecimals = 2;
    }
    let formattedArea = new Intl.NumberFormat(cultureCode, {
        maximumFractionDigits: maxDecimals
    }).format(area);
    if (includeUnits) {
        return formattedArea + ' '+(language[units] || units);
    }
    return formattedArea;

};
