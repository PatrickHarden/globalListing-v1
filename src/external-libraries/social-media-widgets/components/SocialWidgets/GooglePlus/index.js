import React, { Component } from 'react';
import PropTypes from 'prop-types';
import asyncScriptTag from '../../../utils/asyncScriptTag.js';

export default class GooglePlus extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const googlePlusScriptId = 'google-sdk';

    // If script tag exists reload service.
    if (document.getElementById(googlePlusScriptId)) {
      this.reloadService();
    }

    // Load <script> asynchronously.
    const asyncTag = new asyncScriptTag();
    var scripTagExists = asyncTag.write(
      '//apis.google.com/js/platform.js',
      googlePlusScriptId
    );

    scripTagExists
      .then(value => {
        this.reloadService();
      })
      .catch(e => {
        //error handling
      });
  }

  componentWillUpdate() {
    this.reloadService();
  }

  reloadService() {
    if (window.gapi && gapi.plusone && gapi.plusone.go) {
      window.gapi.plusone.go();
    }
  }

  render() {
    return (
      <div className="react-social-widget react-social-widget--google">
        <div
          className="g-plusone"
          data-size="medium"
          data-annotation="none"
          data-href={this.props.urlt}
        />
      </div>
    );
  }
}

GooglePlus.propTypes = {
  url: PropTypes.string.isRequired
};
