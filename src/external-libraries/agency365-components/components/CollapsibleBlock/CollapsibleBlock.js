import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class CollapsibleBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.startExpanded || !props.isCollapsible,
      extraCollapse: !props.startExpanded
    };

    this.renderTitle = this.renderTitle.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('resize', () => this.update());
    // we don't know content height until first render
    // so re-run once to in case we need to hide content
    this.update();
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', () => this.update());
  }

  update() {
    if (this._isMounted) {
      this.forceUpdate();
    }
  }

  handleClick() {
    if (this.props.isCollapsible) {
      this.setState(
        {
          expanded: !this.state.expanded,
          extraCollapse: false
        },
        () => {
          setTimeout(() => {
            if (!this.state.expanded) {
              this.setState({
                extraCollapse: true
              });
            }
          }, 400);
        }
      );
    } else {
      this.setState({ expanded: true, extraCollapse: false });
    }
  }

  renderTitle() {
    const { title } = this.props;
    if (title && typeof title === 'string') {
      return <h2 className={this.props.titleClassName}>{title}</h2>;
    }
    return title;
  }

  render() {
    const {
      innerClassName,
      className,
      headerClassName,
      bodyClassName,
      children
    } = this.props;

    const { expanded } = this.state;
    const contentHeight = this.refs.content
      ? this.refs.content.scrollHeight
      : 0;
    const expandedClass = expanded ? 'is_expanded' : '';
    const marginTop = expanded
      ? 0
      : `-${contentHeight + (this.state.extraCollapse ? 500 : 0)}px`;

    return (
      <div className={classNames(className, expandedClass)}>
        <div onClick={this.handleClick} className={headerClassName}>
          {this.renderTitle()}
        </div>
        <div className={classNames(bodyClassName, 'external-libraries-collapsible-block-content')}>
          <div
            ref="content"
            className={classNames(innerClassName, 'external-libraries-collapsible-block-contentInner')}
            style={{ marginTop }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

CollapsibleBlock.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  innerClassName: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
  titleClassName: PropTypes.string,
  startExpanded: PropTypes.bool,
  isCollapsible: PropTypes.bool
};

CollapsibleBlock.defaultProps = {
  className: '',
  headerClassName: '',
  bodyClassName: '',
  innerClassName: '',
  children: undefined,
  title: '',
  titleClassName: '',
  startExpanded: false,
  isCollapsible: true
};
