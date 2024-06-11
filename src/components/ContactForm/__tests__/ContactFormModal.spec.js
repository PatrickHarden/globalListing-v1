import ContactFormModal from '../ContactFormModal';
import { IntlProvider, FormattedRelative } from 'react-intl';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

describe('<ContactFormModal>', function() {
    it('Should render the contact form with the correct properties and title when isShown is true', () => {
        const renderer = createRenderer();

        const intlProvider = new IntlProvider({ locale: 'en' }, {});
        const { intl } = intlProvider.getChildContext();

        const props = {
            isShown: true,
            contact: {
                email: 'an@email.com',
                name: 'contact name'
            },
            property: {
                PropertyId: '123',
                ActualAddress: {
                    line1: 'an address'
                }
            },
            recaptchaKey: 'xxrecaptchaxx',
            apiUrl: 'xxapiurlxx',
            intl
        };

        renderer.render(<ContactFormModal.WrappedComponent {...props} />);
        const output = renderer.getRenderOutput();
        const modalBody = output.props.children[1];
        const contactForm = modalBody.props.children[2];
        expect(contactForm.props.RecipientEmailAddress).toEqual('an@email.com');
        expect(contactForm.props.PropertyId).toEqual('123');
        expect(contactForm.props.recaptchaKey).toEqual('xxrecaptchaxx');
        expect(contactForm.props.ApiUrl).toEqual('xxapiurlxx');
        expect(contactForm.props.PropertyAddress.line1).toEqual('an address');
    });
});
