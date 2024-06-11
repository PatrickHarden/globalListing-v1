import PropTypes from 'prop-types';

module.exports = {
    closeHandler: PropTypes.func,
    isShown: PropTypes.bool,
    contact: PropTypes.object.isRequired,
    property: PropTypes.object.isRequired,
    labels: PropTypes.object,
    recaptchaKey: PropTypes.string.isRequired,
    apiUrl: PropTypes.string.isRequired,
    siteId: PropTypes.string.isRequired
};