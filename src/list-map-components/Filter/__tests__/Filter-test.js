import React from 'react';
import Filter from '../Filter';
import { GmapsAutoComplete } from '../../../external-libraries/agency365-components/components';
import getAppContext from '../../../utils/getAppContext';
import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType, findWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('Filter component', function() {
    let context = getAppContext();
    let props = {
        filter: {
            placement: 'foo'
        },
        placement: 'bar',
        isFormGroup: true
    };

    describe('rendering filters', function() {
        it("should render nothing if placements don't match", function() {
            shallowRenderer.render(<Filter {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            expect(renderedComponent).toBe(null);
        });

        it('should render a form group if the isFormGroup property is passed', function() {
            props.placement = 'foo';
            shallowRenderer.render(<Filter {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            let wrapperElement = findWithClass(
                renderedComponent,
                'formGroup'
            )[0];
            expect(wrapperElement).not.toBe(null);
        });

        it('should render the GmapsAutoComplete if the renderSearch property is passed', function() {
            props.renderSearch = true;
            shallowRenderer.render(<Filter {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            let searchElement = findWithType(
                renderedComponent,
                GmapsAutoComplete
            );
            expect(searchElement).not.toBe(null);
        });
    });
});
