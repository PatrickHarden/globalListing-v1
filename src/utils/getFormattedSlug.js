module.exports = function(property, format){
    format = format || '';

    var address = property.ActualAddress,
        formattedAddress = format.toLowerCase();

    // Swap string tokens
    for (var line in address) {
        formattedAddress = formattedAddress.replace('%(' + line.toLowerCase() + ')s', address[line]);
    }

    // Remove any unmatched tokens
    formattedAddress = formattedAddress.replace(/%\(([A-Za-z\d]+)\)s/g, '');

    // Slugify
    return formattedAddress.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};
