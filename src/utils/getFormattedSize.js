/**
 * Takes area and units
 * Returns formatted string representation
 * eg. area: 10.5, units: 'ft' --> 10 ft 6 in
 *
 * @param {Number} area - The area in integer or decimal format
 * @param {string} units - The unit type to display
 */
export default (area, units) => {
    switch (units) {
        case 'ft':
            if (area === parseInt(area)) {
                return `${area} ${units}`;
            } else {
                const feet = Math.floor(area);
                const remainder = area % 1;
                const inches = Math.round(remainder * 12 * 100) / 100;
                return `${feet} ft ${inches} in`;
            }
        default:
            return `${area} ${units}`;
    }
};
