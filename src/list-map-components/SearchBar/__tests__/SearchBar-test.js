import React from 'react';
import SearchBar from '../SearchBar';
import { Button } from '../../../external-libraries/agency365-components/components';
import { IntlProvider } from 'react-intl';
import ApplyAppContext from '../../../components/ApplyAppContext';
import TestUtils from 'react-dom/test-utils';
import getAppContext from '../../../utils/getAppContext';
import propertyStub from '../../../../test/stubs/rawPropertyStub';
import ReactDOM from 'react-dom';

describe('SearchBar', function() {
    describe('when component mounts', function() {
        let context;
        let renderedComponent;

        const props = {
            activeTab: 'list',
            setTabViewFunc: () => {},
            breakpoints: {}
        };

        beforeEach(() => {
            context = getAppContext();
            context.stores.FavouritesStore.setFavourites(
                propertyStub,
                false,
                false
            );
            context.stores.ConfigStore.setConfig({
                features: {
                    enableFavourites: true
                }
            });
            context.language = require('../../../config/sample/master/translatables.json').i18n;

            renderedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SearchBar {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );
        });

        afterEach(() => {
            let context;
            let renderedComponent;
        });

        it('should render an is_selected class on the active tab', function() {
            const mapActiveComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SearchBar {...props} activeTab="map" />
                    </ApplyAppContext>
                </IntlProvider>
            );

            const listActiveComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SearchBar {...props} activeTab="list" />
                    </ApplyAppContext>
                </IntlProvider>
            );

            const mapTabLink = TestUtils.findRenderedDOMComponentWithClass(
                mapActiveComponent,
                'is_selected'
            );
            const listTabLink = TestUtils.findRenderedDOMComponentWithClass(
                listActiveComponent,
                'is_selected'
            );

            expect(mapTabLink.classList).toContain('ribbon_item_link__list');
            expect(listTabLink.classList).toContain('ribbon_item_link__map');
        });

        it('should render the additional filter area in its closed state initially', function() {
            const filterAreas = TestUtils.scryRenderedDOMComponentsWithClass(
                renderedComponent,
                'cbre_dropdown'
            );

            expect(filterAreas.length).toBe(0);
        });

        it('should render the additional filter area when Button is clicked', function(done) {
            const toggleFilterAreaButton = TestUtils.findRenderedDOMComponentWithClass(
                renderedComponent,
                'cbre_button__toggle_filter_area'
            );

            TestUtils.Simulate.click(toggleFilterAreaButton);

            setTimeout(() => {
                const filterAreas = TestUtils.scryRenderedDOMComponentsWithClass(
                    renderedComponent,
                    'cbre_dropdown'
                );
                expect(filterAreas.length).toBe(1);
                done();
            });
        });

        it('should not render the additional filter area when Button is clicked and filters are disabled', function() {
            renderedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SearchBar {...props} disabled={true} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            const toggleFilterAreaButton = TestUtils.findRenderedDOMComponentWithClass(
                renderedComponent,
                'cbre_button__toggle_filter_area'
            );

            TestUtils.Simulate.click(toggleFilterAreaButton);

            const filterAreas = TestUtils.scryRenderedDOMComponentsWithClass(
                renderedComponent,
                'cbre_dropdown'
            );

            expect(filterAreas.length).toBe(0);
        });

        it('should render two Buttons in the additional filter area', () => {
            const toggleFilterAreaButton = TestUtils.findRenderedDOMComponentWithClass(
                renderedComponent,
                'cbre_button__toggle_filter_area'
            );

            TestUtils.Simulate.click(toggleFilterAreaButton);

            const buttons = TestUtils.scryRenderedComponentsWithType(
                renderedComponent,
                Button
            );

            expect(buttons.length).toBe(2);
        });

        it('should render a favourites button with favourites count when favouritesActive state is set', function(done) {
            renderedComponent = TestUtils.findRenderedComponentWithType(
                renderedComponent,
                SearchBar
            );
            renderedComponent.setState(
                {
                    favouritesCount: 5
                },
                function() {
                    const markup = ReactDOM.findDOMNode(renderedComponent);
                    const FavouritesButton = markup.getElementsByClassName(
                        'cbre_button__favourite'
                    );
                    const FavouritesCount = markup.getElementsByClassName(
                        'cbre_count'
                    );

                    expect(FavouritesCount.length).toBe(1);

                    expect(FavouritesCount[0].innerText).toBe('5');
                    done();
                }
            );
        });
    });
});
