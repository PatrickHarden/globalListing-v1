import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FacebookShare from './FacebookShare';
import GooglePlus from './GooglePlus';
import LinkedInShare from './LinkedInShare';
import TwitterTweet from './TwitterTweet';
import { PinItButton } from './Pinterest/components/PinItButton';

export default class SocialWidgets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shortUrl: '',
      canonicalUrl: '',
    };
  }

  componentDidMount() {
    this.pollBitlyUrlForTwitter();
    if(document.querySelector("link[rel='canonical']")){
      this.setState({canonicalUrl: encodeURI(document.querySelector("link[rel='canonical']").href)});
    }else{
      this.setState({canonicalUrl: this.props.url}); // Fall back if canonical is missing for some reason
    }
  }

  pollBitlyUrlForTwitter(){
    let ticks = 0;
    var polling = setInterval(() => {
      if (this.state.shortUrl == ''){
        if (document.getElementById('bitlyUrl')){
          this.setState({shortUrl: document.getElementById('bitlyUrl').value});
          clearInterval(polling);
        }
      }
      ticks = ticks + 1;
      if (ticks >= 4) {
        this.setState({shortUrl: this.state.canonicalUrl}); // Fall back if the bitly url fails to come through
        clearInterval(polling);
      }
    }, 250);
  }

  renderFacebookShare(services) {
    if (services.facebookShare && this.props.facebookAppId) {
      return (
        <FacebookShare
          facebookAppId={this.props.facebookAppId}
          url={encodeURIComponent(this.state.canonicalUrl)}
        />
      );
    }
  }

  renderLinkedInShare(services) {
    if (services.linkedInShare) {
      return <LinkedInShare shareText={this.props.shareText} />;
    }
  }

  renderPintrestPinIt(services) {
    if (services.pintrestPinIt) {
      return (
        <div
          key={'pintrest'}
          className="react-social-widget react-social-widget--pintrest"
        >
          <PinItButton
            type="one"
            media={this.props.media}
            url={this.state.canonicalUrl}
            description={this.props.shareText}
          />
        </div>
      );
    }
  }

  renderTwitterTweet(services) {
    if (services.twitterTweet) {
      if (this.state.shortUrl != ''){
        return (<TwitterTweet url={this.state.shortUrl} shareText={this.props.shareText} />);
      }
    }
  }

  renderGooglePlus(services) {
    if (services.googlePlus) {
      return <GooglePlus url={this.state.canonicalUrl} />;
    }
  }

  render() {
    const services = this.props.socialServices;

    return (
      <div className="react-social-widgets">
        {this.renderFacebookShare(services)}
        {this.renderLinkedInShare(services)}
        {this.renderPintrestPinIt(services)}
        {this.renderTwitterTweet(services)}
        {this.renderGooglePlus(services)}
      </div>
    );
  }
}

SocialWidgets.propTypes = {
  socialServices: PropTypes.object.isRequired,
  facebookAppId: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  shareText: PropTypes.string,
  media: PropTypes.string
};

SocialWidgets.defaultProps = {
  socialServices: {
    facebookShare: true,
    linkedInShare: true,
    pintrestPinIt: true,
    twitterTweet: true,
    googlePlus: true
  },
  facebookAppId: '',
  url: '',
  shareText: '',
  media: ''
};
