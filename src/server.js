var express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    searchRoute = require('./server/routes/search'),
    listingsRoute = require('./server/routes/listings'),
    alternateListingsRoute = require('./server/routes/alternateListings'),
    listMapRoute = require('./server/routes/listMap'),
    carouselRoute = require('./server/routes/carousel'),
    proxy = require('express-http-proxy');
require('dotenv').config();
var api = process.env.API_URL || 'http://cbre-search-ci.cloudapp.net',
    cdn =
        process.env.CDN ||
        'https://uatlistingssearchcbreeuw.blob.core.windows.net';

app.use(cors());

// This is used only for lcal development

app.use('/testsearch', searchRoute);
app.use('/carousel', carouselRoute);
app.use('/listmap*', listMapRoute);
app.use('/this-is/a-test-route', alternateListingsRoute);
app.use('/this-is/a-test-route/*', alternateListingsRoute);

app.set('views', __dirname + '/templates');
app.set('view engine', 'pug');
if (process.env.STUBBING === 'true') {
    const commercial =
        process.env.STUB_COMMERCIAL === 'true' ? '_commercial' : '';
    const zero = process.env.STUB_ZERO === 'true' ? 'zero_' : '';
    const lm = process.env.STUB_LISTMAP === 'true' ? 'lm_' : '';
    const flex = process.env.STUB_FLEX === 'true' ? 'flex_' : undefined;

    app.use(
        '/api/propertylistings/query*',
        proxy('http://localhost:3000', {
            forwardPath: function() {
                return `http://localhost:3000/stubs/${flex ? flex : lm}${zero}properties${commercial}.json`;
            }
        })
    );

    app.use(
        '/api/propertylisting/*',
        proxy('http://localhost:3000', {
            forwardPath: function() {
                return `http://localhost:3000/stubs/${flex ? flex : lm}${zero}property${commercial}.json`;
            }
        })
    );
} else {
    app.use(
        '/api/*',
        proxy(api, {
            forwardPath: function(req) {
                let returnPath = api + req.originalUrl;
                returnPath = decodeURIComponent(returnPath).replace(
                    /&amp;/g,
                    '&'
                );
                return returnPath;
            }
        })
    );
}

// Resources to blob storage
app.use(
    '/resources*',
    proxy(cdn, {
        forwardPath: function(req) {
            return cdn + req.originalUrl.substring('/resources'.length);
        }
    })
);

app.use(express.static(__dirname + '/../release'));
app.use('/public', express.static('public'));
app.use('/server', express.static('server'));
app.use('/fonts', express.static('public/fonts'));
app.use('/images', express.static('public/images'));
app.use('/config', express.static('public/config'));
app.use('/*', listingsRoute);

app.use(bodyParser.json());

app.listen(process.env.PORT || 3000);

module.exports = app;
