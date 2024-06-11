import React, { Component } from 'react';
import PropTypes from 'prop-types';
import asyncScriptTag from '../../../utils/asyncScriptTag.js';

export default class LinkedInShare extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const linkedInScriptId = 'linkedIn-script';

    // If script tag exists reload service.
    if (document.getElementById(linkedInScriptId)) {
      this.reloadService();
    }

    // Load <script> asynchronously.
    const asyncTag = new asyncScriptTag();
    var scripTagExists = asyncTag.write(
      '//platform.linkedin.com/in.js',
      linkedInScriptId
    );

    scripTagExists
      .then(value => {
        this.reloadService();
      })
      .catch(e => {
        //error handling
      });
  }

  componentDidUpdate() {
    this.reloadService();
  }

  reloadService() {
    if (window.IN && window.IN.parse) {
      window.IN.parse();
    }
  }

  render() {
    const dataUrl = document.querySelector("link[rel='canonical']") 
      ? document.querySelector("link[rel='canonical']").href
      : window.location.href;

    return (
      <div className="react-social-widget react-social-widget--linkedin">
        <script type="IN/Share" data-url={dataUrl}/>
      </div>
    );
  }
}

LinkedInShare.propTypes = {
  shareText: PropTypes.string.isRequired
};
