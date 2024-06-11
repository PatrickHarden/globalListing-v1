import PropTypes from 'prop-types';
import React from 'react';
import { ExpandableContent } from '../../external-libraries/agency365-components/components';
import { createDataTestAttribute } from '../../utils/automationTesting';

const ExpandableText = (props, context) => {

    const title = typeof props.title === 'string' ? (<h2 className="cbre_h2" data-test={createDataTestAttribute('',props.dataTestName)}>{props.title}</h2>) : props.title;
    const showMoreString = props.showMoreString || context.language.LMExpandableTextMore;
    const showLessString = props.showLessString || context.language.LMExpandableTextLess;
    const { numberOfLines: limit, ...other } = props;

    const componentProps = {
        limit,
        ...other,
        title,
        showMoreString,
        showLessString
    };

    return (
        <ExpandableContent {...componentProps}>
            {props.children}
        </ExpandableContent>
    );
};

ExpandableText.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    showHideClassName: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.node,
    showMoreString: PropTypes.string,
    showLessString: PropTypes.string,
    startExpanded: PropTypes.bool,
    limit: PropTypes.number,
    lineHeight: PropTypes.number,
    dataTestName: PropTypes.string
};

ExpandableText.defaultProps = {
    className: 'marginBottom-xs-1 paddingX-xs-1',
    contentClassName: 'cbre_expandableText',
    showHideClassName: 'showHideToggle has_arrow cbre_smallText',
    limit: 4,
    mode: 'lines',
    lineHeight: 1.4,
    dataTestName: ''
};

ExpandableText.contextTypes = {
    language: PropTypes.object
};

export default ExpandableText;