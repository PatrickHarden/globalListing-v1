import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Email from './Email';
import Telephone from './Telephone';
import { Col } from 'react-bootstrap';

export default class Contacts extends Component {
    renderTelephone = (contactGroup, contact) => {
        if (!contact || !contact.telephone) {
            return;
        }
        return (
            <Col className={'col--telephone col-xs-6'}>
                <Telephone
                    buttonType={'flyout'}
                    name={contactGroup.name || contact.name}
                    telephone={contact.telephone}
                    propertyId={this.props.property.PropertyId}
                />
            </Col>
        );
    };

    renderEmail = contact => {
        if (!contact || !contact.email) {
            return;
        }

        return (
            <Col className={'col--email col-xs-6'}>
                <Email
                    property={this.props.property}
                    RecipientEmailAddress={contact.email}
                />
            </Col>
        );
    };

    renderContacts = () => {
        const contactWrapperClass = this.props.contactClass || '';
        const { ContactGroup } = this.props.property;

        return ContactGroup.contacts.map(
            function(contact, index) {
                if (!ContactGroup.name && !contact.name) {
                    return null;
                }

                // Limit to 2 items.
                if (index > 1) {
                    return null;
                }

                return (
                    <div
                        className={contactWrapperClass}
                        key={'contact-' + index}
                    >
                        <div className={'contact-cta'}>
                            <div className={'contact--name col-xs- no-padding'}>
                                {contact.name || ContactGroup.name}
                            </div>
                            <div
                                className={
                                    'contact--telephone-email no-padding'
                                }
                            >
                                {this.renderTelephone(ContactGroup, contact)}
                                {this.renderEmail(contact)}
                            </div>
                        </div>
                    </div>
                );
            }.bind(this)
        );
    };

    render() {
        return <div className={'col--contacs'}>{this.renderContacts()}</div>;
    }
}

Contacts.propTypes = {
    property: PropTypes.object.isRequired,
    contactClass: PropTypes.string
};
