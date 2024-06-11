export const createDataTestAttribute = (prepend, value) => {
    try{
        let dataTestAttribute = '';
        if(prepend && prepend.length > 0){
            dataTestAttribute += prepend.replace(/\s+/g, '-').toLowerCase();
        }
        if(dataTestAttribute.length > 0){
            dataTestAttribute += '-';
        }
        if(value && typeof value === 'number'){
            value = value.toString();
        }
        if(value && value.length > 0){
            dataTestAttribute += value.replace(/\s+/g, '-').toLowerCase();
        }
        return dataTestAttribute;
    }catch(e){
        return '';
    }
};