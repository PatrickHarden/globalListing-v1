import React from 'react';
import ReactDOM from 'react-dom';
import Jumbotron, { renderElement } from '../Jumbotron';
import sinon from 'sinon';
import { createRenderer } from 'react-test-renderer/shallow';
import {
    findWithClass,
    findAllWithClass,
    findWithType,
    findAllWithType
} from 'react-shallow-testutils';
let renderer = createRenderer();

describe('Jumbotron', () => {
    describe('renderElement', () => {
        describe('when passed a string', () => {
            it('should render an element of the appropriate type', () => {});
        });
        describe('when passed a component instance', () => {
            it('should render the component', () => {});
        });
    });
    describe('Jumbotron', () => {
        describe('when passed string props', () => {
            let jumbo;
            let spy;

            beforeEach(() => {
                spy = sinon.spy();
                const props = {
                    heading: 'Heading text',
                    subtitle: 'Subtitle text',
                    button: 'Button text',
                    onClick: spy
                };

                jumbo = renderer.render(<Jumbotron {...props} />);
            });
            it('should create an <h2> from props.heading', () => {
                const elem = findWithType(jumbo, 'h2');
                expect(elem).not.toBe(null);
                expect(elem.props.children).toEqual('Heading text');
            });
            it('should create a <p> from props.subtitle', () => {
                const elem = findWithType(jumbo, 'p');
                expect(elem).not.toBe(null);
                expect(elem.props.children).toEqual('Subtitle text');
            });
            it('should create a <button> from props.button', () => {
                const elem = findWithType(jumbo, 'button');
                expect(elem).not.toBe(null);
                expect(elem.props.children).toEqual('Button text');
            });
            it('should apply props.onClick to the <button>', () => {
                const elem = findWithType(jumbo, 'button');
                elem.props.onClick();
                expect(spy.calledOnce).toBe(true);
            });
        });
        describe('when passed component instance props', () => {
            let jumbo;

            beforeEach(() => {
                const props = {
                    heading: <h1>Heading 2</h1>,
                    button: <button potato="interesting" />
                };

                jumbo = renderer.render(<Jumbotron {...props} />);
            });
            it('should render the given components', () => {
                expect(findWithType(jumbo, 'h1')).not.toBe(null);
                expect(findWithType(jumbo, 'button')).not.toBe(null);
            });
            it('should not render unspecified components', () => {
                expect(() => findWithType(jumbo, 'p')).toThrow();
            });
            it('should retain the props the instance was given', () => {
                const { potato } = findWithType(jumbo, 'button').props;
                expect(potato).toBe('interesting');
            });
        });
    });
});
