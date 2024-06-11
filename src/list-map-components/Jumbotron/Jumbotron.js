import React from 'react';
import classNames from 'classnames';

/**
 * Jumbotron with three optional sections
 * Each section can take a component instance or string
 * Strings will have default class, type applied
 * Component instances will be rendered as is
 *
 * @param {boolean} isListCollapsed - Is sidebar expanded
 * @param {string|component} heading - h2 Header content
 * @param {string|component} subtitle - Smaller text under heading
 * @param {string|component} button - button with an optional onClick
 * @param {string|component} altButton - additonal button with an optional onClick
 */
export default function Jumbotron(props) {
    const outerClass = ['jumbotron', props.outerClass];
    const contentClass = ['jumbotron_content', props.outerClass];
    const buttonOuterClass = ['jumbotron_buttons', props.buttonOuterClass];
    const buttonClass = ['cbre_button', props.buttonClass];

    const { altButton, isListCollapsed } = props;

    const colClass =
        altButton || isListCollapsed ? 'col-md-5' : 'col-md-8 center-block';
    const offsetClass = altButton && !isListCollapsed && 'col-md-offset-1';

    return (
        <div className={classNames(outerClass)}>
            <div className={classNames(contentClass)}>
                <div className="row">
                    <div className="col-xs-12 col-md-9 center-block">
                        {renderElement(props.heading, 'h2')}
                        {renderElement(props.subtitle, 'p', {
                            className: 'cbre_largeText'
                        })}
                    </div>
                </div>
            </div>

            <div className={classNames(buttonOuterClass)}>
                <div className="row">
                    <div
                        className={classNames([
                            colClass,
                            'col-xs-12',
                            offsetClass
                        ])}
                    >
                        {renderElement(props.button, 'button', {
                            onClick: props.onClick,
                            className: classNames(buttonClass)
                        })}
                    </div>
                    {altButton && (
                        <div className={classNames([colClass, 'col-xs-12'])}>
                            {renderElement(altButton, 'button', {
                                onClick: props.altOnClick,
                                className: classNames(buttonClass)
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function renderElement(content, type, props) {
    // if given string, creates element w/ requested type and props
    // otherwise assume passed component instance and just return
    if (!content) {
        return '';
    }
    if (typeof content === 'string') {
        return React.createElement(type, props, content);
    }
    return content;
}
