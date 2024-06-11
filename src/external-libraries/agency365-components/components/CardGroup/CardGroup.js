import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card } from '../../components';
import { evalTemplateString } from '../../utils';

/**
 * CardGroup
 * @example
 * <CardGroup>
 *      <Card>...</Card>
 *      <Card>...</Card>
 *      ...
 * </CardGroup>
 * @param {Object} props
 * @param {!node} props.children - Must be type `Card`
 * @param {string} props.tokenisedStatus - Default '%(visible)s items of %(total)s'
 * @param {string} props.tokenisedStatusStatic - e.g. '%(total)s items'
 * @param {number} props.teaserCount - Default 2
 * @param {string} object.viewMoreText - Default { more: 'view more', less: 'view less' }
 * @param {boolean} props.renderList
 * @param {boolean} props.asListItem
 * @param {string} props.scrollToTopOf - Must be a unique element selector(e.g. .class, #id...)
 * @returns {Element}
 */
class CardGroup extends Component {
  static defaultProps = {
    tokenisedStatus: '%(visible)s items of %(total)s',
    teaserCount: 2,
    viewMoreText: {
      more: 'view more',
      less: 'view less'
    }
  };

  static propTypes = {
    children: PropTypes.any.isRequired,
    tokenisedStatus: PropTypes.string,
    tokenisedStatusStatic: PropTypes.string,
    teaserCount: PropTypes.number,
    viewMoreText: PropTypes.object,
    renderList: PropTypes.bool,
    asListItem: PropTypes.bool,
    scrollToTopOf: PropTypes.string,
    className: PropTypes.string,
    features: PropTypes.object
  };

  constructor(props) {
    super(props);
    const {features} = props;
    this.state = { viewMore: features.expandByDefault? true: false };
    this.handleViewMore = this.handleViewMore.bind(this);
  }

  handleViewMore(e) {
    e.preventDefault(this);

    const { scrollToTopOf } = this.props;

    if (scrollToTopOf) {
      const el = document.querySelector(scrollToTopOf);
      if (el) {
        el.scrollTop = this.bannerLink.offsetTop;
      }
    }

    this.setState({
      viewMore: !this.state.viewMore
    });
  }

  renderChildren() {
    const { children, teaserCount, renderList} = this.props;
    
    const viewMore = this.state.viewMore;

    return Children.map(children, (child, i) =>
      cloneElement(child, {
        isHidden: viewMore ? false : i >= teaserCount,
        asListItem: renderList
      })
    );
  }

  render() {

    const {
      children,
      teaserCount,
      tokenisedStatus,
      tokenisedStatusStatic,
      viewMoreText,
      renderList,
      asListItem,
      className,
      features,
      ...other
    } = this.props;
    const { viewMore } = this.state;
    const buttonText = viewMore ? viewMoreText.less : viewMoreText.more;
    const total = children.length;
    const visible = viewMore ? total : teaserCount;

    const bannerText = evalTemplateString(tokenisedStatus, { visible, total });

    const staticBannerText =
      tokenisedStatusStatic &&
      evalTemplateString(tokenisedStatusStatic, { total });

    let bannerMarkup;
    let bannerContainerClass;
    if (total > teaserCount) {
      bannerContainerClass = '';
      bannerMarkup = (
        <div className="external-libraries-card-group-banner banner">
          <div className="banner_content">
            {bannerText}
          </div>
          <a
            href="#"
            className="banner_toggle showHideToggle"
            onClick={this.handleViewMore}
            ref={node => (this.bannerLink = node)}
          >
            {buttonText}
          </a>
        </div>
      );
    } else if (total <= teaserCount && staticBannerText) {
      bannerContainerClass = '';
      bannerMarkup = (
        <div className="external-libraries-card-group-banner banner">
          <div className="banner_content">
            {staticBannerText}
          </div>
        </div>
      );
    }

    const Type = asListItem ? 'li' : 'div';
    const RenderType = renderList ? 'ul' : 'div';

    const classes = ['external-libraries-card-group-container', bannerContainerClass, className];

    return (
      <Type className={classNames(classes)}>
        <RenderType className="external-libraries-card-group-list cardGroup_list">
          {this.renderChildren()}
        </RenderType>

        {bannerMarkup}
      </Type>
    );
  }
}

// CardGroup.defaultProps = {
//   tokenisedStatus: '%(visible)s items of %(total)s',
//   teaserCount: 2,
//   viewMoreText: {
//     more: 'view more',
//     less: 'view less'
//   },
//   tokenisedStatusStatic: '',
//   renderList: false,
//   asListItem: false,
//   scrollToTopOf: '',
//   className: ''
// };

// CardGroup.propTypes = {
//   children: PropTypes.instanceOf(Card).isRequired,
//   tokenisedStatus: PropTypes.string,
//   tokenisedStatusStatic: PropTypes.string,
//   teaserCount: PropTypes.number,
//   viewMoreText: PropTypes.object,
//   renderList: PropTypes.bool,
//   asListItem: PropTypes.bool,
//   scrollToTopOf: PropTypes.string,
//   className: PropTypes.string
// };

export default CardGroup;
