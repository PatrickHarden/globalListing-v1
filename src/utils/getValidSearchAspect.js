module.exports = function (aspects) {

    var validSearchAspects = ["isSale", "isLetting", "isSold", "isLeased"];

    var validSearchAspect = "isLetting";

    aspects.forEach((x)=>{
        if (validSearchAspects.includes(x))
            validSearchAspect = x;
    })
    
    return validSearchAspect;
};