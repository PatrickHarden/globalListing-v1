import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TwitterTweet extends Component {

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "//platform.twitter.com/widgets.js";
    script.async = false;
    script.onload = () => this.scriptLoaded();
    document.body.appendChild(script);
  }

  render() {
    const tweet = `https://twitter.com/intent/tweet?text=${this.props.shareText}&url=${this.props.url}`;

    return (
      <div className="react-social-widget react-social-widget--twitter">
        <a class="twitter-share-button" href={tweet}></a>
      </div>
    );
  }
}

TwitterTweet.propTypes = {
  url: PropTypes.string.isRequired,
  shareText: PropTypes.string.isRequired
};
