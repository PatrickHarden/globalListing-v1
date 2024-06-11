import React, { Component } from 'react';
import PropTypes from 'prop-types';
const styles = {
  iframe: {
    border: 'none',
    position: 'static',
    visibility: 'visible'
  }
};

export default class FacebookShare extends Component {
  render() {
    if (!this.props.facebookAppId) {
      return null;
    }

    return (
      <div className="react-social-widget react-social-widget--facebook">
        <iframe
          src={
            'https://www.facebook.com/plugins/share_button.php?href=' +
            this.props.url +
            '&layout=button&mobile_iframe=false&appId=' +
            this.props.facebookAppId +
            '&width=58&height=20'
          }
          width="58"
          height="20"
          style={styles.iframe}
          scrolling="no"
          allowTransparency="true"
        />
      </div>
    );
  }
}

FacebookShare.propTypes = {
  facebookAppId: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};
