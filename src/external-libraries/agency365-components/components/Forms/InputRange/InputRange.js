import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import classNames from 'classnames';

class InputRangeWrapper extends Component {
  renderLabel() {
    const labelClass = [this.props.labelClass];

    return <span className={classNames(labelClass)}>{this.props.label}</span>;
  }

  renderRangeSlider() {
    const wrapClass = [this.props.className];
    return (
      <div className={classNames(wrapClass)}>
        <InputRange {...this.props} />
      </div>
    );
  }

  render() {
    return (
      <div className="InputRangeInnerWrap">
        {this.props.showLabel ? this.renderLabel(this.props) : null}

        {this.renderRangeSlider(this.props)}
      </div>
    );
  }
}

InputRangeWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
  labelClass: PropTypes.string
};

InputRangeWrapper.defaultProps = {
  label: '',
  showLabel: false,
  className: '',
  labelClass: ''
};

export default InputRangeWrapper;
