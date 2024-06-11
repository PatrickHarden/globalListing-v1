import ShareModal from '../ShareModal';
import getAppContext from '../../../utils/getAppContext';
import React from 'react';

import { createRenderer } from 'react-test-renderer/shallow';
let renderer = createRenderer();

describe('ShareModal', function() {
    let context, props, output, modalHeader, modalBody;

    beforeEach(() => {
        context = getAppContext();
        context.language = require('../../../config/sample/master/translatables.json').i18n;
        props = { open: true };
    });

    afterEach(() => {
        context = props = output = modalHeader = modalBody = null;
    });

    it('should render a modal with header and body', () => {
        context.stores.ConfigStore.setItem('features', {
            useSocialWidgets: true
        });
        renderer.render(<ShareModal {...props} />, context);
        output = renderer.getRenderOutput();
        modalHeader = output.props.children[0];
        modalBody = output.props.children[1];

        expect(modalHeader).not.toBe(null);
        expect(modalBody).not.toBe(null);
    });

    describe('When social widgets feature is enabled', () => {
        it('should render social widgets section', () => {
            context.stores.ConfigStore.setItem('features', {
                useSocialWidgets: true
            });
            renderer.render(<ShareModal {...props} />, context);
            output = renderer.getRenderOutput();
            modalBody = output.props.children[1];
            const socialWidgets = modalBody.props.children.props.children[1];

            expect(socialWidgets).not.toBe(null);
        });
    });

    describe('When social widgets feature is disabled', () => {
        it('should not render the social widgets section', () => {
            context.stores.ConfigStore.setItem('features', {
                useSocialWidgets: false
            });
            renderer.render(<ShareModal {...props} />, context);
            output = renderer.getRenderOutput();
            modalBody = output.props.children[1];
            const socialWidgets = modalBody.props.children.props.children[1];

            expect(socialWidgets).toBe(null);
        });
    });
});
