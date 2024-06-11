var React = require('react'),
    ReactDOM = require('react-dom'),
    PropertyLink = require('../PropertyLink').default,
    ReactRouterContext = require('../../../../../test/ReactRouterContext'),
    PropertyStore = require('../../../../stores/PropertyStore'),
    getAppContext = require('../../../../utils/getAppContext');
import { createRenderer } from 'react-test-renderer/shallow';

describe('Component', function() {
    describe('<PropertyLink />', function() {
        describe('#render()', function() {
            it('should priortise searchType prop over store value', function() {
                var renderer = createRenderer();
                var context = getAppContext();

                renderer.render(
                    <PropertyLink
                        searchResultsPage="/"
                        searchType={'isLetting'}
                        property={{
                            PropertyId: '123',
                            ActualAddress: {
                                line1: 'prop1 line 1',
                                line2: 'prop1 line 2',
                                postCode: "test\\!#$&;=? []~|tes't--tes`t/",
                                urlAddress: ''
                            }
                        }}
                        propertyIndex={1}
                    />,
                    context
                );

                var output = renderer.getRenderOutput();
                expect(output.props.href).toBe('/details/123/?view=isLetting');
            });
        });
    });
});
