import PropTypes from 'prop-types';
import React, { Component } from 'react';

class LoadingViewResidential extends Component {

    render() {

        return (
            <div className="wrapper pdp">
              <div className="main" id="main">

                <div className="subnav">
                  <div className="cbre_container paddingX-lg-1">
                    <div className="subnav_links">
                      <span className="subnav_link"></span>
                    </div>
                  </div>
                </div>

                <div className="cbre_body">
                  <div className="cbre_heroWrap">
                    <div className="hide-xs show-lg">
                      <div className="imageWrap">
                      </div>
                    </div>
                  </div>

                  <div className="cbre_container">
                    <div className="cbre_sidebar cbre_sidebar__placeholder cbre_sidebar__tabletLandscapeAndUp cbre_sidebar__overlapHero cbre_sidebar__placeholder_top_margin">
                      <div className="row">
                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                          <div className="padding-xs-1">
                            <div className="cbre_flex">
                              <div className="flexGrow-xs-1">
                                <div className="placeholder__h1"></div>
                                <div className="placeholder__subh1"></div>
                                <div className="placeholder__subh2"></div>
                              </div>
                            </div>
                            <div className="cbre_divider cbre_divider__large marginTop-xs-1 hide-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="cbre_contentBySidebar propertyDescription">
                      <div className="row marginTop-lg-1">
                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                          <div className="paddingX-xs-1 marginBottom-xs-1">
                            <div className="placeholder__p"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="collapsableBlock marginTop-md-1 uncollapsable-md">
                    <div className="collapsableBlock_body">
                      <div className="collapsableBlock_body_inner">
                        <div className="cbre_map" data-component="map" data-disable-scroll="true">
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

        );
    }
}

LoadingViewResidential.contextTypes = {
    language: PropTypes.object
};

export default LoadingViewResidential;