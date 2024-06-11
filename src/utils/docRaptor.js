window.docraptorJavaScriptFinishedTimeout = false;
setTimeout(function(){
    window.docraptorJavaScriptFinishedTimeout = true;
}, 10000);

window.docraptorJavaScriptFinished = () => { // eslint-disable-line
    return window.renderme || window.docraptorJavaScriptFinishedTimeout;
};

//docraptorJavaScriptFinished();
