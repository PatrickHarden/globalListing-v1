import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    FontIcon,
    Avatar,
    Contact,
    ExpandableContent
} from '../../external-libraries/agency365-components/components';
import { createDataTestAttribute } from '../../utils/automationTesting';

export default class ContactList extends Component {
    static propTypes = {
        property: PropTypes.object.isRequired,
        className: PropTypes.string,
        limit: PropTypes.number,
        showContactForm: PropTypes.func
    };

    static contextTypes = {
        stores: PropTypes.object,
        language: PropTypes.object
    };
    static defaultProps = {
        limit: 2,
        contactClass: 'col-xs-12 col-md-12 col-lg-12 center-block',
        contactWrapperClass: 'contact cbre_button cbre_button__avatar row',
        showContactForm: () => {}
    };

    constructor(props) {
        super(props);
    }

    getContactsArray = () => {
        const { property } = this.props;
        const { contacts } = property.ContactGroup;
        let truncatedContacts = contacts.slice(0, this.props.limit);

        return truncatedContacts
            .map(contact => {
                if (!contact.name || contact.name.length === 0) {
                    return;
                }

                const image = contact.avatar || '';
                const avatar = (
                    <Avatar src={image} size={32} altText={contact.name} />
                );

                const icons = [];
                if (contact.telephone) {
                    icons.push(
                        <FontIcon
                            className="cbre_icon"
                            iconName="icon_phone"
                            key="iconPhone"
                        />
                    );
                }
                if (contact.email) {
                    icons.push(
                        <FontIcon
                            className="cbre_icon"
                            iconName="icon_mail"
                            key="iconMail"
                        />
                    );
                }

                const onClick = e => {
                    this.props.showContactForm(e, contact);
                };

                return {
                    ...contact,
                    avatar,
                    icons,
                    onClick
                };
            })
            .filter(contact => !!contact);
    };

    renderContact = (contact, i) => {
        const { contactClass, contactWrapperClass } = this.props;
        if (
            this.context.stores.ConfigStore.getFeatures().displayAgentsTitle &&
            contact.agenttitle &&
            contact.agenttitle.content
        ) {
            contact.jobtitle = `${contact.agenttitle.content}`;
        }

        if (this.context.stores.ConfigStore.getFeatures().displayLicenseNumber && contact.license)
        {
            var licenseNumberPrefix = "";

            if (this.context.stores.ConfigStore.getItem('i18n').LicenseNumberPrefix)
                licenseNumberPrefix = this.context.stores.ConfigStore.getItem('i18n').LicenseNumberPrefix;

            contact.jobtitle = licenseNumberPrefix + contact.license;          
        }

        return (
            <li key={`contact_${i}`}>
                <div className={contactWrapperClass} data-test={createDataTestAttribute('contact',i)}>
                    <Contact className={contactClass} {...contact} />
                </div>
            </li>
        );
    };

    render() {
        const { ContactGroup } = this.props.property;
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getFeatures();
        let brokerLimit = 4;
        if (features.limitBrokers) {
            brokerLimit = features.limitBrokers;
        }
        if (
            !ContactGroup ||
            !ContactGroup.contacts ||
            !ContactGroup.contacts.length
        ) {
            return null;
        }

        const contactsArray = this.getContactsArray(ContactGroup);

        return (
            <ul className={`contacts ${this.props.className}`}>
                <ExpandableContent
                    showMoreString={language.LMExpandableTextMore}
                    showLessString={language.LMExpandableTextLess}
                    showHideClassName="showHideToggle has_arrow cbre_smallText"
                    mode="items"
                    limit={brokerLimit}
                >
                    {contactsArray.map(this.renderContact)}
                </ExpandableContent>
            </ul>
        );
    }
}
