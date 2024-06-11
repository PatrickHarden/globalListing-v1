import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * FormGroup
 * @example
 * <FormGroup legend="form group title">
 *     <input />
 *     <input />
 * </FormGroup>
 *
 * @param {Object} props
 * @param {!node} props.children
 * @param {boolean} props.isCollapsible - Default `false`
 * @param {boolean} props.isCollapsed - Default `false`
 * @param {string} props.legend
 * @param {Object} props.viewMoreText - Default { more: `show`, less: `hide` }
 * @param {string} props.className
 * @returns {Element}
 */
class FormGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: !props.isCollapsed };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse = (e) => {
    e.preventDefault(this);
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  };

  render() {

    const {
      isCollapsible,
      legend,
      viewMoreText,
      className,
      children,
      ...other
    } = this.props;

    const { isExpanded } = this.state;

    const showHideToggleText = isExpanded
      ? viewMoreText.less
      : viewMoreText.more;

    let legendMarkup;
    if (legend) {
      legendMarkup = (
        <legend className="external-libraries-form-group-legend formLegend">{legend}</legend>
      );

      if (isCollapsible) {
        legendMarkup = (
          <div className="external-libraries-form-group-legend_wrap formLegendWrap">
            {legendMarkup}
            <a
              href="#"
              onClick={this.toggleCollapse}
              className="external-libraries-form-group-toggle showHideToggle"
            >
              {showHideToggleText}
            </a>
          </div>
        );
      }
    }

    let bodyMarkup;
    if (isExpanded || !isCollapsible) {
      bodyMarkup = <div className="external-libraries-form-group-body">{children}</div>;
    }

    const classes = [
      'external-libraries-form-group-container',
      className,
      legend && 'external-libraries-form-group-hasLegend',
      isExpanded && 'external-libraries-form-group-isExpanded'
    ];
    const fieldsetProps = Object.assign({}, ...other);
    delete fieldsetProps.isCollapsibled;
    delete fieldsetProps.isCollapsed;

    return (
      <fieldset className={classNames(classes)} {...fieldsetProps}>
        {legendMarkup}
        {bodyMarkup}
      </fieldset>
    );
  }
}

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  isCollapsible: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  legend: PropTypes.string,
  viewMoreText: PropTypes.object,
  className: PropTypes.string
};

FormGroup.defaultProps = {
  isCollapsible: false,
  isCollapsed: false,
  viewMoreText: {
    more: 'show',
    less: 'hide'
  },
  className: '',
  legend: ''
};

export default FormGroup;
