import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import modalContainer from '../modalContainer';

describe('modalContainer', function() {
    let WrappedMockComponent;
    let renderedMockComponent;
    let renderedOutput;
    let mockProperty;
    let mockContact;
    let modalRef;

    beforeEach(function () {
        class MockComponent extends Component {
            render(){
                return (<div />);
            }
        }
        const WrappedMockComponent = modalContainer(MockComponent);

        mockProperty = {
            foo: 'bar'
        };
        mockContact = {
            foo: 'bar'
        };

        renderedOutput = TestUtils.renderIntoDocument(
            <WrappedMockComponent />
        );

        renderedMockComponent = TestUtils.findRenderedComponentWithType(renderedOutput, MockComponent);

        renderedMockComponent.props.modal.addModal('contact');
    });

    afterEach(function () {
        WrappedMockComponent = undefined;
        renderedMockComponent = undefined;
        renderedOutput = undefined;
        mockProperty = undefined;
        mockContact = undefined;
    });

    describe('Rendering', function () {
        it('should append a `modal` prop to its child component', function () {
            expect(renderedMockComponent.props.modal).not.toBeUndefined();
        });
    });

    describe('modal.show', function () {
        it('should change the state of the component', function (done) {
            renderedMockComponent.props.modal.getModal('contact').show(
                mockProperty,
                mockContact
            );
            setTimeout(() => {
                expect(renderedOutput.state['contact'].property).toEqual(mockProperty);
                expect(renderedOutput.state['contact'].contact).toEqual(mockProperty);
                expect(renderedOutput.state['contact'].open).toEqual(true);
                done();
            });
        });
    });

    describe('modal.hide', function () {
        it('should change the state of the component', function (done) {
            renderedMockComponent.props.modal.getModal('contact').hide();
            setTimeout(() => {
                expect(renderedOutput.state['contact'].open).toEqual(false);
                done();
            });
        });
    });

});
