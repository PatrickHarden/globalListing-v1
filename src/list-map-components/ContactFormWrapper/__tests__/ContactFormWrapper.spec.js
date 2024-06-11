import React from 'react';
import ContactFormWrapper from '../ContactFormWrapper';
import { Avatar } from '../../../external-libraries/agency365-components/components';
import ContactFormModal from '../../../components/ContactForm/ContactFormModal';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('ContactFormWrapper', function() {
    describe('when component mounts', function() {
        let ContactFormWrapperComponent;
        let ContactFormComponent;

        const props = {
            modal: {
                open: true,
                contact: {
                    name: 'Joe Bloggs'
                },
                property: {
                    foo: 'bar'
                },
                route: { path: '' }
            }
        };

        beforeEach(function() {
            ContactFormWrapperComponent = shallowRenderer.render(
                <ContactFormWrapper {...props} />,
                {
                    stores: {
                        ConfigStore: {
                            getItem: () => {
                                return 'hello';
                            }
                        }
                    }
                }
            );
            ContactFormComponent = findAllWithType(
                ContactFormWrapperComponent,
                ContactFormModal
            );
        });

        afterEach(function() {
            ContactFormWrapperComponent = undefined;
            ContactFormComponent = undefined;
        });

        it('should render a ContactFormModal component', function() {
            expect(ContactFormComponent.length).toEqual(1);
        });

        it('should pass in other defined props', function() {
            expect(ContactFormComponent[0].props.property).toEqual(
                props.modal.property
            );
            expect(ContactFormComponent[0].props.isShown).toEqual(
                props.modal.open
            );
            expect(ContactFormComponent[0].props.recaptchaKey).toEqual('hello');
            expect(ContactFormComponent[0].props.apiUrl).toEqual('hello');
            expect(ContactFormComponent[0].props.siteId).toEqual('hello');
        });
    });
});
