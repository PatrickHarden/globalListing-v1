import _ from 'lodash';

export function getQueryParameters(queryParams) {
    if (!queryParams) {
        return {};
    }
    let returnValue = _.unescape(queryParams)
        .replace(/(^\?)/, '')
        .replace(/&amp;/g, '&')
        .replace(/\s/g, '')
        .split('&')
        .map(
            function (n) {
                return (
                    (n = n.split('=')),
                    (this[n[0]] = decodeURIComponent(n[1])),
                    this
                );
            }.bind({})
        )[0];
    return returnValue;
}

export function mergeParameters(staticParams, urlParams) {
    Object.assign(staticParams, urlParams);

    return staticParams;
}
