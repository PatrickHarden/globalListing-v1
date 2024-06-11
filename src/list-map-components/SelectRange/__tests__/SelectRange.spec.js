import React from 'react';
import ReactDOM from 'react-dom';
import SelectRange from '../SelectRange';
import { Select } from '../../../external-libraries/agency365-components/components';
import sinon from 'sinon';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType, findAllWithClass } from 'react-shallow-testutils';
let renderer = createRenderer();

describe('SelectRange', () => {
    describe('when passed props and rendered', () => {
        let selectRange;
        let spy;

        const filter = {
            name: 'Dynamic.SalePrice',
            type: 'range',
            label: 'Price',
            minLabel: 'Min price',
            maxLabel: 'Max price',
            placement: 'lm_primaryFilter',
            conditional: {
                'Common.Aspects': 'isSale'
            },
            minValues: [
                {
                    value: '',
                    label: 'No min',
                    default: true,
                    type: 'min'
                },
                {
                    value: '500000',
                    label: '£500,000',
                    type: 'min'
                },
                {
                    value: '600000',
                    label: '£600,000',
                    type: 'min'
                },
                {
                    value: '700000',
                    label: '£700,000',
                    type: 'min'
                }
            ],
            maxValues: [
                {
                    value: '600000',
                    label: '£600,000',
                    type: 'max'
                },
                {
                    value: '700000',
                    label: '£700,000',
                    type: 'max'
                },
                {
                    value: '800000',
                    label: '£800,000',
                    type: 'max'
                },
                {
                    label: 'No max',
                    value: '',
                    default: true,
                    type: 'max'
                }
            ]
        };

        const props = {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValues: filter.minValues,
            maxValues: filter.maxValues,
            onChangeComplete: spy,
            value: {
                min: filter.minValues[0],
                max: filter.maxValues[0]
            },
            showLabel: true,
            filter
        };

        beforeEach(() => {
            spy = sinon.spy();

            selectRange = renderer.render(<SelectRange {...props} />);
        });

        it('should render two Select components', () => {
            const selects = findAllWithType(selectRange, Select);

            expect(selects.length).toBe(2);
        });
    });
});
