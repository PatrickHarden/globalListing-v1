import React from 'react';
import Table, { Row, Cell } from '../../Table/Table';
import { createDataTestAttribute } from '../../../utils/automationTesting';

const BuildingStatusInformation = (props) => {
    const { context } = props;

    const buildBuildingStatusInformation = (property) => {
        const { language, stores } = context;

        const buildingStatusInformation = [];

        if (property.PropertyStatus) {
            buildingStatusInformation.push({
                id: 'buildingStatus',
                title: language['PdpBuildingStatus'],
                value: language[`BuildingStatus${property.PropertyStatus.charAt(0).toLowerCase() + property.PropertyStatus.slice(1).replace(/\s/g, '')}`]
            });
        }

        if (stores.ConfigStore.getFeatures().showStoriesInBuildingStatus && property.NumberOfStoreys) {
            buildingStatusInformation.push({
                id: 'stories',
                title: language['NumberOfStories'],
                value: property.NumberOfStoreys
            });
        }

        if (property.YearBuilt) {
            buildingStatusInformation.push({
                id: 'yearBuilt',
                title: language['YearBuilt'],
                value: property.YearBuilt
            });
        }  
        
        return buildingStatusInformation;
    }

    const cells = buildBuildingStatusInformation(props.property);

    return (
        <React.Fragment>
            {cells.length ?
                <Table>
                    <Row>
                        {cells.map(({ id, title, value }) => (
                            <Cell key={id + title + value + Math.floor(Math.random() * Math.floor(1000)) + ''} widthXs={6} widthSm={5} widthLg={4} data-test={createDataTestAttribute('pdp-building-information-section', title)}>
                                <h3 className="cbre_h6">{title}</h3>
                                {value}
                            </Cell>
                        ))}
                    </Row>
                </Table>
                : null
            }
        </React.Fragment>
    );

}


export default BuildingStatusInformation;