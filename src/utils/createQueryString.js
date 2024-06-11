export default function(obj, append) {
    const query = Object.keys(obj)
        .filter(key => obj[key] !== '' && obj[key] !== null && obj[key] !== undefined)
        .map(key => `${key}=` + encodeURIComponent(`${obj[key]}`))
        .join('&');

    return query.length > 0 ? `${append ? '&' : '?'}${query}` : null;
}
