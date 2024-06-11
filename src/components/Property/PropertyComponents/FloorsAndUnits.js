import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class FloorsAndUnits extends Component {
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

    getFloorsAndUnitData = () => {
        const items = this.props.floors;
        const language = this.context.language;
        const features = stores.ConfigStore.getItem('features');
        const culture = features.sizeCultureCode? features.sizeCultureCode : stores.ConfigStore.getItem('language'); 
        const floors = [];
        const numberFormat = new Intl.NumberFormat(
            culture,
            {
                maximumFractionDigits: 0
            }
        );

        items.forEach(
            function(item, itemIndex) {
                const statusClass = item.status
                    ? ' ' + item.status.toLowerCase()
                    : '';

                // Render each floor.
                floors.push(
                    <tr key={'row-' + (itemIndex + 1)}>
                        <th>{item.subdivisionName}</th>
                        <th>{language[item.use]}</th>
                        <th>
                            {numberFormat.format(item.unitSize.area) +
                                this.context.language[item.unitSize.units]}
                        </th>
                        <th
                            className={
                                'cbre-icon cbre-circle status' + statusClass
                            }
                        >
                            <span className="status-text">
                                {language[item.status]}
                            </span>
                        </th>
                    </tr>
                );
            }.bind(this)
        );

        return floors;
    };

    render() {
        const language = this.context.language;

        if (!this.props.floors || !this.props.floors.length) {
            return null;
        }

        return (
            <div className={'pdp-floors collapsable-block'}>
                <h3>{language.PdpFloorsAvailableTitle}</h3>
                <span
                    className={
                        'pull-right expand-toggle cbre-icon cbre-chevron-down'
                    }
                />
                <table className={'collapsable-content'}>
                    <thead>
                        <tr>
                            <th>{language.FloorsAndUnits}</th>
                            <th>{language.Details}</th>
                            <th>{language.Size}</th>
                            <th>{language.Status}</th>
                        </tr>
                    </thead>
                    <tbody>{this.getFloorsAndUnitData()}</tbody>
                </table>
            </div>
        );
    }
}

FloorsAndUnits.propTypes = {
    floors: PropTypes.array.isRequired
};

FloorsAndUnits.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};
