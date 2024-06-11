import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getEmSizeInPixels } from '../../utils';
import classNames from 'classnames';

/**
 * Expandable Text
 * @example
 * <ExpandableContent
 *    startExpanded={true}
 *    mode="items"
 *    limit={2}
 * >
 *    <p>Shown by default</p>
 *    <p>Shown by default</p>
 *    <p>Hidden by default</p>
 * </ExpandableContent>
 *
 *  @param {Object} props
 * @param {!node} props.children - Node(s) to render out
 * @param {node} props.title - String or node, string will be wrapped in <h2>
 * @param {boolean} props.startExpanded - Whether to show all content on mount. Default: false
 * @param {boolean} props.mode - How to limit content displayed.
 *        'items' mode counts children, 'lines' uses line-height to show X lines
 * @param {number} props.limit - Number of children/lines to show when contracted
 * @param {number} props.lineHeight - Override default line height in 'lines' mode
 * @param {string} props.showMoreString - Text to display on link to expand
 * @param {string} props.showLessString - Text to display on link to contract
 * @param {function} props.onClick - click handler executed after default functionality
 * @returns {Element}
 */
export default class ExpandableContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.startExpanded,
      showShowMore: true,
      setUpComplete: false
    };
  }

  componentDidMount() {
    this.updateShowShowMore();
  }

  componentDidUpdate() {
    this.updateShowShowMore();
  }

  setBodyContentRef = (ref) => {
    if (!this.state.setUpComplete) {
      this.bodyContent = ref;
      this.setState({
        setUpComplete: true
      });
    }
  };

  handleClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      expanded: !this.state.expanded,
      setUpComplete: false
    });

    this.props.onClick(e);
  };

  updateShowShowMore = () => {
    let showShowMore;
    if (this.props.mode === 'items') {
      showShowMore = this.props.children.length > this.props.limit;

      if (showShowMore !== this.state.showShowMore) {
        this.setState({ showShowMore });
      }
    } else {
      // lines
      if (this.bodyContent && !this.state.expanded) {
        showShowMore =
          this.bodyContent.scrollHeight > this.bodyContent.clientHeight;

        if (showShowMore !== this.state.showShowMore) {
          this.setState({ showShowMore });
        }
      }
    }
  };

  renderShowMore = () => {
    const {
      mode,
      children,
      lineHeight,
      showHideClassName,
      showMoreString,
      showLessString,
      limit
    } = this.props;

    const { expanded, showShowMore } = this.state;

    const { bodyContent, handleClick } = this;

    if (!showShowMore) {
      return null;
    }

    // don't render if content is empty
    if (mode === 'items') {
      if (children.length < limit) {
        return null;
      }
    } else {
      // lines
      if (children === '') {
        return null;
      }

      if (bodyContent) {
        const totalLines = Math.ceil(
          bodyContent.clientHeight / getEmSizeInPixels(lineHeight, bodyContent)
        );

        const maxHeight = parseInt(bodyContent.style.maxHeight, 10);
        const visibleHeight = maxHeight
          ? getEmSizeInPixels(maxHeight, bodyContent)
          : bodyContent.clientHeight; // eslint-disable-line

        const totalHeightLessThanVisibleHeight =
          bodyContent.scrollHeight < visibleHeight; // eslint-disable-line
        const visibleHeightLessThanOrEqualToLineHeight =
          bodyContent.clientHeight <=
          getEmSizeInPixels(lineHeight, bodyContent); // eslint-disable-line
        const totalLinesLessThanOrEqualToLimit =
          !maxHeight && totalLines <= limit; // eslint-disable-line

        if (
          totalHeightLessThanVisibleHeight ||
          visibleHeightLessThanOrEqualToLineHeight ||
          totalLinesLessThanOrEqualToLimit
        ) {
          return null;
        }
      }
    }

    const expandedClass = expanded ? 'is_expanded' : '';

    const showHideClasses = classNames(
      'external-libraries-expandable-content-showHideLink',
      showHideClassName,
      expandedClass
    );

    return (
      <a href="#" className={showHideClasses} onClick={handleClick}>
        {expanded ? showLessString : showMoreString}
      </a>
    );
  };

  render() {
    const {
      className,
      contentClassName,
      children,
      lineHeight,
      title,
      mode,
      limit
    } = this.props;

    const { expanded, setUpComplete } = this.state;

    const expandedClass = expanded ? 'is_expanded' : '';

    const outerClasses = className; // in case this needs extending
    const innerClasses = classNames(
      'external-libraries-expandable-content',
      contentClassName,
      expandedClass
    );
    const contentStyles = { lineHeight };

    // Can take string or node - default to h2 if string
    const titleNode =
      title && typeof title === 'string' ? <h2>{title}</h2> : title;

    // lines mode - clamp the content
    if (!expanded && mode === 'lines') {
      contentStyles.maxHeight = `${limit * lineHeight}em`;
    }

    // items mode - limit # items shown
    let content = children;
    if (!expanded && mode === 'items') {
      content = children.slice(0, limit);
    }

    let showMore;
    if (setUpComplete) {
      showMore = this.renderShowMore();
    }

    return (
      <div className={outerClasses}>
        {titleNode}
        <div
          ref={(ref) => {
            this.setBodyContentRef(ref);
          }}
          className={innerClasses}
          style={contentStyles}
        >
          {content}
        </div>
        {showMore}
      </div>
    );
  }
}

ExpandableContent.propTypes = {
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  showHideClassName: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
  showMoreString: PropTypes.string,
  showLessString: PropTypes.string,
  startExpanded: PropTypes.bool,
  mode: PropTypes.string,
  limit: PropTypes.number,
  lineHeight: PropTypes.number,
  onClick: PropTypes.func
};

ExpandableContent.defaultProps = {
  className: '',
  contentClassName: '',
  showHideClassName: '',
  children: '',
  title: '',
  startExpanded: false,
  showMoreString: 'More',
  showLessString: 'Less',
  limit: 5,
  lineHeight: 1.2,
  mode: 'lines',
  onClick: () => {}
};
