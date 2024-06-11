import React from 'react';
import sinon from 'sinon';
import { __RewireAPI__ } from '../PageMetaData';
import PageMetaData  from '../PageMetaData';
import getAppContext from '../../../utils/getAppContext';
import writeMetaTag from '../../../utils/writeMetaTag';
import ApplyAppContext from '../../../components/ApplyAppContext';
import property from '../../../../test/stubs/processedPropertyStub';
import TestUtils from 'react-dom/test-utils'

describe('PageMetaData', function() {
  describe('when component mounts', function () {
    let context = null;
    let props = null;
    let url = null;
    let mockWriteMetaTags = null;
    let renderedComponent = null;

    beforeEach(function () {
        window.cbreSiteType = 'commercial';
        props = {
          searchType: 'isLetting',
          searchResultsPage: '/'
        };

        context = getAppContext();
        context.stores.SearchStateStore.setItem('searchLocationName', 'Smurf Town, Manchester');
        context.stores.ParamStore.setParam('location', 'Smurf Town, Manchester');
        context.language = require('../../../config/sample/master/translatables.json').i18n;

        url = window.location.href;
        mockWriteMetaTags = sinon.spy();
        __RewireAPI__.__Rewire__('writeMetaTag', mockWriteMetaTags);

        renderedComponent = TestUtils.renderIntoDocument(
            <ApplyAppContext passContext={context}>
                <PageMetaData {...props} />
            </ApplyAppContext>
        );

    });

    afterEach(function () {
        window.cbreSiteType = undefined;
        props = undefined;
        context = undefined;
        url = null;
        mockWriteMetaTags = null;
        renderedComponent = null;
        __RewireAPI__.__ResetDependency__('writeMetaTag');
    });

    it('should NOT call writeMetaTags when disableMetaData config is set', function () {
        let mockWriteMetaTagsWithConfig = sinon.spy();
        __RewireAPI__.__Rewire__('writeMetaTag', mockWriteMetaTagsWithConfig);

        context.stores.ConfigStore.setConfig({ disableMetaData: true });

        renderedComponent = TestUtils.renderIntoDocument(
            <ApplyAppContext passContext={context}>
                <PageMetaData {...props} />
            </ApplyAppContext>
        );

        sinon.assert.notCalled(mockWriteMetaTagsWithConfig);
    });

    it('should call the writeMetaTags() function and set a title', function () {
        sinon.assert.calledWith(mockWriteMetaTags, 'title', 'Properties to Rent in Smurf Town, Manchester - CBRE Commercial', 'title');
        sinon.assert.calledWith(mockWriteMetaTags, 'title', 'Properties to Rent in Smurf Town, Manchester - CBRE Commercial', 'html');
        sinon.assert.calledWith(mockWriteMetaTags, 'title', 'Properties to Rent in Smurf Town, Manchester - CBRE Commercial');
    });

    it('should call the writeMetaTags() function and set a description', function () {
        sinon.assert.calledWith(mockWriteMetaTags, 'description', "View CBRE's Properties to Rent in Smurf Town, Manchester - CBRE Commercial", 'html');
        sinon.assert.calledWith(mockWriteMetaTags, 'description', "View CBRE's Properties to Rent in Smurf Town, Manchester - CBRE Commercial");
        sinon.assert.calledWith(mockWriteMetaTags, 'og:description', "View CBRE's Properties to Rent in Smurf Town, Manchester - CBRE Commercial");
    });

    it('should call the writeMetaTags() function and set a url', function () {
        sinon.assert.calledWith(mockWriteMetaTags, 'og:url', url, 'meta');
        sinon.assert.calledWith(mockWriteMetaTags, 'canonical', url, 'link');
    });

    it('should add passed params to the canonical URL', function() {
        props.canonicalParams = ['location'];

        renderedComponent = TestUtils.renderIntoDocument(
            <ApplyAppContext passContext={context}>
                <PageMetaData {...props} property={property} />
            </ApplyAppContext>
        );

        sinon.assert.calledWith(mockWriteMetaTags, 'canonical', url + '?location=Smurf%20Town,%20Manchester', 'link');
    });

    it('should call the writeMetaTags() function and set a structured title for the current property when property prop is passed', function () {
        renderedComponent = TestUtils.renderIntoDocument(
            <ApplyAppContext passContext={context}>
                <PageMetaData {...props} property={property} />
            </ApplyAppContext>
        );

        sinon.assert.calledWith(mockWriteMetaTags, 'title', 'Properties to Rent in Smurf Town, Manchester - CBRE Commercial', 'title');
        sinon.assert.calledWith(mockWriteMetaTags, 'title', 'Properties to Rent in Smurf Town, Manchester - CBRE Commercial', 'html');
        sinon.assert.calledWith(mockWriteMetaTags, 'title', 'Properties to Rent in Smurf Town, Manchester - CBRE Commercial');
    });

    it('should call the writeMetaTags() function and set a structured description for the current property when property prop is passed', function () {
        renderedComponent = TestUtils.renderIntoDocument(
            <ApplyAppContext passContext={context}>
                <PageMetaData {...props} property={property} />
            </ApplyAppContext>
        );

        sinon.assert.calledWith(mockWriteMetaTags, 'description', 'Some property description with less words for testing.', 'html');
        sinon.assert.calledWith(mockWriteMetaTags, 'description', 'Some property description with less words for testing.');
        sinon.assert.calledWith(mockWriteMetaTags, 'og:description', 'Some property description with less words for testing.');
    });
  });
});
