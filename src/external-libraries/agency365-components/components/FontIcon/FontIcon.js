import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * FontIcon
 * @example
 *  let mouseEnterHandler = event => {}
 *  <FontIcon
 *    iconName="icon_phone"
 *    onMouseEnter={mouseEnterHandler}
 *  />
 */
class FontIcon extends Component {
  state = {
    hovered: false
  };

  handleMouseLeave = (event) => {
    this.setState({ hovered: false });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event);
    }
  };

  handleMouseEnter = (event) => {
    this.setState({ hovered: true });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };

  /**
   * @param {Object} props
   * @param {!string} props.iconName
   * @param {string} props.color
   * @param {function} props.onMouseEnter
   * @param {function} props.onMouseLeave
   * @returns {Element}
   */
  render() {
    const { iconName, color, className, ...other } = this.props;
    const { hovered } = this.state;

    const classes = [
      'FontIcon',
      className,
      iconName && 'FontIcon_' + iconName,
      hovered && 'FontIcon_isHovered',
      color && 'FontIcon_' + color
    ];

    return (
      <span
        className={classNames(classes)}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        {...other}
      >
        {this.props.children}
      </span>
    );
  }
}

FontIcon.propTypes = {
  color: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  iconName: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

FontIcon.defaultProps = {
  color: '',
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  className: '',
  children: ''
};

export default FontIcon;