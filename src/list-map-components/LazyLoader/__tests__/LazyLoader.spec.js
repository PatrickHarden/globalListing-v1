import React from 'react';
import LazyLoad from 'react-lazyload';

import LazyLoader from '../';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';

let shallowRenderer = createRenderer();

describe('Component', function() {
    describe('<LazyLoader />', function() {
        let props;
        let context;
        let component;

        beforeEach(function() {
            props = {
                foo: 'bar',
                children: [<div>test</div>]
            };
            context = {};
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
            component = undefined;
        });

        describe('#render()', function() {
            it('should render a LazyLoader as default or if disable === false', function() {
                shallowRenderer.render(<LazyLoader {...props} />, context);
                component = shallowRenderer.getRenderOutput();

                expect(findAllWithType(component, LazyLoad).length).toBe(1);
            });
            it('should render a span with children intact if disable === true', function() {
                shallowRenderer.render(<LazyLoader {...props} disable />, context);
                component = shallowRenderer.getRenderOutput();

                expect(findAllWithType(component, LazyLoad).length).toBe(0);
                expect(findAllWithType(component, 'div').length).toBe(1);
            });
        });
    });
});
