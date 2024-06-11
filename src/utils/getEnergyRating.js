import scriptPath from './getScriptPath';

export default (features, highlights) => {
    if (!features || !features.displayEnergyRating || !highlights) return null;

    let energyRating;
    const isExempt = new RegExp(/Exempt BER Certification/);
    const hasRating = new RegExp(/BER Certification/);

    highlights.forEach(highlight => {
        if (isExempt.test(highlight)) {
            energyRating = 'Exempt';
        } else if (hasRating.test(highlight)) {
            energyRating = highlight.slice(0, 2).trim();
        }
    });

    return energyRating ? `${scriptPath()}/images/energyRatings/${energyRating}.png` : null;
};
