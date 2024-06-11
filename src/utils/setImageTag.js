function setImageTag(imageCaption, actualAddress, index) 
{    
    let alt = imageCaption ? imageCaption.replace(/\..+$/, '') : '';
    let address = actualAddress && (actualAddress.line1 + " " + actualAddress.line2).trim();
    const parsed = parseInt(index);
    let newIndex = isNaN(parsed) ? 1 : parsed + 1;

    if (alt === '' && address) 
    {
        return address.concat( " - Image " + newIndex);
    }
    return alt;
}

module.exports = setImageTag;