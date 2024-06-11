import React from 'react';
import PropTypes from 'prop-types';
import PropertyPhotoGrid from '../PropertyPhotoGrid';
import getAppContext from '../../../../utils/getAppContext';
import PhotoArray from './PhotoArray.json';

import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType, findWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('PropertyPhotoGrid component', function() {
    let context = getAppContext();
    context.language = require('../../../../config/sample/master/translatables.json').i18n;
    let props = {
        property: {
            Photos: PhotoArray
        },
        siteType: 'residential'
    };

    describe('rendering PropertyPhotoGrid', function() {
        it('should render PropertyPhotoGrid', function() {
            shallowRenderer.render(<PropertyPhotoGrid {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            expect(renderedComponent).not.toBe(null);
        });

        it('should remove a class from the third image if siteType is residential', function() {
            props.siteType = 'residential';
            shallowRenderer.render(<PropertyPhotoGrid {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            const className =
                renderedComponent.props.children[2].props.className;
            expect(className.includes('col-md-6')).toBe(false);
        });

        it('should remove a class from the first image if siteType is commercial', function() {
            props.siteType = 'commercial';
            shallowRenderer.render(<PropertyPhotoGrid {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            const className =
                renderedComponent.props.children[0].props.className;
            expect(className.includes('col-md-6')).toBe(false);
        });
    });
});
