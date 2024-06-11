import React from 'react';
import getAppContext from '../../../utils/getAppContext';
import ContactList from '../ContactList';
import property from '../../../../test/stubs/processedPropertyCommercialStub';
import { Contact } from '../../../external-libraries/agency365-components/components';
import sinon from 'sinon';
import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();
const props = {
    property,
    showContactForm: sinon.spy(),
    limit: 2
};

const context = getAppContext();

describe('Contact List', () => {
    let contactList;

    beforeEach(() => {
        context.language = require('../../../config/sample/master/translatables.json').i18n;
        contactList = shallowRenderer.render(
            <ContactList {...props} />,
            context
        );
    });

    it('should only output first two contacts', () => {
        const contacts = findAllWithType(contactList, Contact);
        expect(contacts.length).toEqual(2);
    });

    it('should call modal launcher when clicked', () => {
        const contacts = findAllWithType(contactList, Contact);
        contacts[0].props.onClick();

        expect(props.showContactForm.calledOnce).toBe(true);
    });

    it('should render agent title when feature is turned on', () => {
        context.stores.ConfigStore.setConfig({
            features: { displayAgentsTitle: true }
        });
        contactList = shallowRenderer.render(
            <ContactList {...props} />,
            context
        );
        const contacts = findAllWithType(contactList, Contact);
        expect(contacts[0].props.name).toEqual('Natalie Lelliott');
        expect(contacts[0].props.jobtitle).toEqual('Agent Title');
        expect(contacts[1].props.name).toEqual('Tom Meijer');
    });
});
