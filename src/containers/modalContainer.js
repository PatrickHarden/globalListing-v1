import PropTypes from 'prop-types';
import React, { Component } from 'react';
import trackingEvent from '../utils/trackingEvent';

export default function modalContainer(WrappedComponent) {
    class ModalContainer extends Component {
        constructor(props) {
            super(props);
            this.state = {};
        }

        addModal = id => {
            if (!this.state[id]) {
                this.setState({
                    [id]: {
                        open: false,
                        property: {},
                        contact: {},
                        show: this.show.bind(this, id),
                        hide: this.hide.bind(this, id)
                    }
                });
            }
        }

        getModal = id => {
            // fallback to expected props
            if (!this.state[id]) {
                return {
                    open: false,
                    property: {},
                    contact: {},
                    show: this.show.bind(this, id),
                    hide: this.hide.bind(this, id),
                    route: this.props.route
                };
            }

            return {
                ...this.state[id],
                route: this.props.route
            };
        }

        hide = (id, e = { preventDefault: ()=>{} }) => {
            e.preventDefault();
            this.setState({
                [id]: {
                    ...this.state[id],
                    open: false
                }
            });
        };

        show = (id, property, contact, e = { preventDefault: ()=>{} }, component, requestType) => {
            e.preventDefault();

            let trackingId = component == 'PDP' ? 'pdpLaunchContactUs' : 'launchContactUs';

            const {
                stores,
                actions
            } = this.context;

            this.setState({
                [id]: {
                    ...this.state[id],
                    open: true,
                    property,
                    contact,
                    requestType
                }
            });

            if(stores && actions && id === 'contact'){
                trackingEvent(trackingId, {
                    propertyId: property.PropertyId
                }, stores, actions);
            }
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    modal={{
                        addModal: this.addModal,
                        getModal: this.getModal,
                        all: {...this.state}
                    }}
                />
            );
        }
    }

    ModalContainer.contextTypes = {
        location: PropTypes.object,
        stores: PropTypes.object,
        actions: PropTypes.object
    };

    return ModalContainer;
}
