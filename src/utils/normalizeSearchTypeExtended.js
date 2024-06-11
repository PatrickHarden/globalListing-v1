module.exports = function(value){
    if (value) {
        const isSale = value.toLowerCase().search('sale') != -1;
        const isLetting = value.toLowerCase().search('letting') != -1;

        if (isSale) {
            if (isLetting) {
                return 'isSaleLetting';
            }
            return 'isSale';
        }

        if (isLetting) {
            return 'isLetting';
        }
    }

    return null;
};
