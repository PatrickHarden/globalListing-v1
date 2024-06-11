import Raven from 'raven-js';

const CaptureError = (error, extras, tags) => {
    if (
        extras.config &&
        extras.config.errorLogging &&
        extras.config.errorLogging.enableErrorLogging &&
        extras.config.errorLogging.errorLoggingConfigUrl !== ''
    ) {
        Raven.config(
            extras.config.errorLogging.errorLoggingConfigUrl
        ).install();

        Raven.setTagsContext(tags);
        Raven.setExtraContext(extras);
        Raven.captureException(error);
    } else {
        console.error('SPA - ' + error, extras, tags);
    }
};

export default CaptureError;
