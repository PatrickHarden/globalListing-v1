module.exports = function(value){

    if (value) {
        if(value.toLowerCase() === 'isletting^issale'){
            return 'isLetting^isSale';
        }
        if(value.toLowerCase() === 'isletting,issale' || value.toLowerCase() === 'issale,isletting'){
            return 'isLetting,isSale';
        }
        if(value.toLowerCase() === 'issale^!isinvestment'){
            return 'isSale^!isInvestment';
        }
        if(value.toLowerCase() === 'issale^isinvestment'){
            return 'isSale^isInvestment';
        }
        if(value.toLowerCase() === 'issold'){
            return 'isSold';
        }
        if(value.toLowerCase() === 'isleased'){
            return 'isLeased';
        }

        if (value.toLowerCase().search('sale') != -1) {
            return 'isSale';
        }

        if (value.toLowerCase().search('letting') != -1) {
            return 'isLetting';
        }
    }

    return null;
};
