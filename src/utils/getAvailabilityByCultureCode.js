export default (availabilityDescription,language) => {
    const filteredAvailability = availabilityDescription.filter(availabilityCulture => availabilityCulture.cultureCode.toLowerCase() === language.toLowerCase());
    if (filteredAvailability && filteredAvailability.length > 0) {
        return filteredAvailability[0].text;
    } else {
        return availabilityDescription[0].text;
    }
}