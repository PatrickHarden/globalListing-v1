module.exports = function(url){
    var scripts,
        thisScript,
        scriptWithSubPath,
        scriptPath,
        _url;

    if(!url){
        scripts = document.getElementById('spa-app') || document.querySelector('script[src*="application"]');
        thisScript = document.currentScript || scripts ? scripts : null;
    }

    if(thisScript || url){
        _url = url || thisScript.src;
        scriptWithSubPath = _url.replace(/[^\/]*$/, '');
        if (scriptWithSubPath.lastIndexOf('/gzip/') !== -1){
            scriptPath = scriptWithSubPath.slice(0, scriptWithSubPath.lastIndexOf('/gzip/'));
        }
        else{
            scriptPath = scriptWithSubPath.slice(0, scriptWithSubPath.lastIndexOf('/js/'));
        }
        
    }

    return scriptPath;
};
