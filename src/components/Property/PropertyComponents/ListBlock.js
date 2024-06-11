import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class ListBlock extends Component {
    getListItems = listData => {
        const listItemClass = this.props.listItemClass || 'list-item';
        // Remove empty array items
        const _listData = _.reject(listData, function(i) {
            return i === '';
        });

        return _listData.map(function(listDatum, index) {
            let renderedValue = listDatum;
            if (
                typeof listDatum === 'object' &&
                listDatum.hasOwnProperty('value') &&
                listDatum.hasOwnProperty('title')
            ) {
                renderedValue = [`${listDatum.title}: `, listDatum.value];
            }

            return (
                <li key={'item-' + (index + 1)} className={listItemClass}>
                    {renderedValue}
                </li>
            );
        });
    };

    componentDidMount() {
        const element = ReactDOM.findDOMNode(this);

        if (element) {
            const toggleNode = element.getElementsByClassName('expand-toggle');

            if (toggleNode.length > 0) {
                toggleNode[0].addEventListener('click', () => {
                    const mainNode = ReactDOM.findDOMNode(this);

                    if (mainNode.classList.contains('expanded')) {
                        mainNode.classList.remove('expanded');
                    } else {
                        mainNode.classList.add('expanded');
                    }
                });
            }
        }
    }

    render() {
        const listData = this.props.listData;
        const listClass = this.props.listClass || 'list-unstyled';

        if (!listData.length) {
            return null;
        }

        return (
            <div className={this.props.wrapperClass}>
                <h3>{this.props.blockTitle}</h3>
                <span
                    className={
                        'pull-right expand-toggle cbre-icon cbre-chevron-down'
                    }
                />
                <ul className={listClass}>{this.getListItems(listData)}</ul>
            </div>
        );
    }
}

ListBlock.propTypes = {
    listData: PropTypes.array.isRequired,
    wrapperClass: PropTypes.string,
    listClass: PropTypes.string,
    listItemClass: PropTypes.string,
    blockTitle: PropTypes.string
};
