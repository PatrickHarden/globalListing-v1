import PropTypes from 'prop-types';
import React from 'react';
import { CollapsibleBlock as _CollapsibleBlock } from '../../external-libraries/agency365-components/components';
import classNames from 'classnames';

const CollapsibleBlock = (props) => {
    const componentProps = {
        ...props,
        className: classNames(
            props.className,
            'collapsableBlock',
            !props.isCollapsible && 'uncollapsable-xs'
        ),
        headerClassName: classNames(props.headerClassName, 'collapsableBlock_header'),
        bodyClassName: classNames(props.bodyClassName, 'collapsableBlock_body'),
        innerClassName: classNames(props.innerClassName, 'collapsableBlock_body_inner'),
        titleClassName: classNames(props.titleClassName, 'cbre_title')
    };

    return (
        <_CollapsibleBlock {...componentProps}>
            {props.children}
        </_CollapsibleBlock>
    );
};

CollapsibleBlock.propTypes = {
    className: PropTypes.string,
    headerClassName: PropTypes.string,
    bodyClassName: PropTypes.string,
    innerClassName: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.node,
    titleClassName: PropTypes.string,
    startExpanded: PropTypes.bool
};

export default CollapsibleBlock;