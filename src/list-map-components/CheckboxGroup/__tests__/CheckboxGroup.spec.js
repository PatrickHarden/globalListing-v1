import React from 'react';
import CheckboxGroup  from '../CheckboxGroup';
import { Checkbox } from '../../../external-libraries/agency365-components/components';
import TestUtils from 'react-dom/test-utils';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';

describe('CheckboxGroup component', function() {
    describe('rendering CheckboxGroup', function () {
        let checkboxGroupComponent;
        let renderedComponent;
        let context;
        let params;
        let props;
        let _event;
        let event;
        let type;
        let operator;

        beforeEach(function () {
            const onFilterChanged = function(e, t, o) {
                event = e;
                type = t;
                operator = o;
            };

            _event = {
                target: {}
            };

            params = {
                checkbox1: 'checked',
                checkbox2: 'true',
                checkbox3: false,
                toggle1: 'toggle1',
                toggle2: 'toggle1,toggle2',
                toggle3: 'toggle3^toggle2',
                toggle4: 'toggle1,toggle2'
            };

            props = {
                onFilterChanged: onFilterChanged,
                options: [
                    {
                        name: 'checkbox1',
                        type: 'checkbox',
                        value: 'checked',
                        uncheckedValue: 'unchecked'
                    },
                    {
                        name: 'checkbox2',
                        type: 'checkbox'
                    },
                    {
                        name: 'checkbox3',
                        type: 'checkbox',
                        value: 'nope'
                    },
                    {
                        name: 'toggle1',
                        type: 'toggle',
                        value: 'toggle1'
                    },
                    {
                        name: 'toggle2',
                        type: 'toggle',
                        action: 'OR',
                        value: 'toggle2'
                    },
                    {
                        name: 'toggle3',
                        type: 'toggle',
                        action: 'AND',
                        value: 'toggle3'
                    },
                    {
                        name: 'toggle4',
                        type: 'toggle',
                        action: 'OR',
                        value: 'toggle4'
                    }
                ]
            };
            context = getAppContext();
            context.stores.ParamStore.setParams(params);
            checkboxGroupComponent = TestUtils.renderIntoDocument(
                <ApplyAppContext passContext={context}>
                    <CheckboxGroup {...props} />
                </ApplyAppContext>
            );
            renderedComponent = TestUtils.findRenderedComponentWithType(checkboxGroupComponent, CheckboxGroup);
        });

        afterEach(function () {
            checkboxGroupComponent = undefined;
            renderedComponent = undefined;
            context = undefined;
            params = undefined;
            props = undefined;
            _event = undefined;
            event = undefined;
            type = undefined;
            operator = undefined;
        });

        it('should render a number of checkboxes', function () {
            const checkboxes = TestUtils.scryRenderedComponentsWithType(
                renderedComponent,
                Checkbox
            );
            expect(checkboxes.length).toBe(7);
        });

        describe('getFilterState', function () {
            describe('A checkbox', function () {
                it('should return true if the value matches its assigned param', function () {
                    const state = renderedComponent.getFilterState(props.options[0]);
                    expect(state).toBe(true);
                });

                it('should return true if its assigned param is true', function () {
                    const state = renderedComponent.getFilterState(props.options[1]);
                    expect(state).toBe(true);
                });

                it('should return false if neither of the previous cases is true', function () {
                    const state = renderedComponent.getFilterState(props.options[2]);
                    expect(state).toBe(false);
                });
            });

            describe('A toggle', function () {
                it('should return true if its value matches its assigned param', function () {
                    const state = renderedComponent.getFilterState(props.options[3]);
                    expect(state).toBe(true);
                });

                it('should return true if its value is present in its assigned param', function () {
                    // OR
                    const orState = renderedComponent.getFilterState(props.options[4]);
                    expect(orState).toBe(true);
                    // AND
                    const andState = renderedComponent.getFilterState(props.options[5]);
                    expect(andState ).toBe(true);
                });

                it('should return false if neither of the previous cases is true', function () {
                    const state = renderedComponent.getFilterState(props.options[6]);
                    expect(state).toBe(false);
                });
            });

        });

        describe('onCheckBoxChanged', function () {
            describe('A checkbox', function () {
                it('should fire the handle prop with some args', function () {
                    const e = Object.assign({}, _event);
                    _event.target.uncheckedValue = 'unchecked';
                    _event.target.checkAction = 'TOGGLE';
                    renderedComponent.onCheckBoxChanged(e, props.options[0]);
                    expect(event).toEqual(_event);
                    expect(type).toBe('bool');
                    expect(operator).toBe(undefined);
                });
            });

            describe('A toggle', function () {
                it('should fire the handle prop with some args', function () {
                    renderedComponent.onCheckBoxChanged(_event, props.options[4]);
                    expect(event).toEqual(_event);
                    expect(type).toBe('toggle');
                    expect(operator).toBe(',');
                });
            });

        });
    });
});
