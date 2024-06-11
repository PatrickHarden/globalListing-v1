[![Build status](https://ci.appveyor.com/api/projects/status/l8639gruxvm57tci?svg=true)](https://ci.appveyor.com/project/EMEAPRODUCTSCBRECOM/agency365-search-spa)

# CBRE Search SPA - v1

##Prerequisites

1. nodejs
2. jQuery must be present as a global in the browser where the app is running

## Development
Note: A valid .env file is required for running locally, see `sample.env` for required keys

1. run `npm install`
2. run `npm run grunt dev`
3. run `npm run grunt dev-notest` (quicker build)

## How to debug live sites:

1. Install fiddler: https://www.telerik.com/download/fiddler
2. In your v1 repository run: npm run grunt dev-notest
3. In fiddler, go to file > capture traffic
4. Refresh the v1 page you want to debug
5. You should see a list of incoming traffic, find application.min.js (ctrl + f) or alternatively, release/css/ if you want to target styles
6. Double click on that connection, and on the right side click on the autoresponder tab
7. Check Enable rules and Unmatched requests passthrough
8. It should look similar to this aside from the local path to your application.min.js file: https://i.imgur.com/KtLAoD4.png
9. Click save

Your webpage should now be pointing towards your local javascript, so you can now debug/test things live.

## Notes

1. Use src/constants/DefaultValues for defaults and reference in code where required

### Unit Testing

Tests use Jasmine 2 run with Karma

Tests are run as part of all the grunt steps, however you can do some nice TDD by running

`npm run grunt test`

This will start an auto-watch instance of the karma runner.

UPDATE:
A more reliable test run option during dev appears to be `npm run grunt karma:unit`

## Releasing

### TO BE REWRITTEN

    testing out build

    To release the a new version to blob storage

## The real release process:

    1. Create and gco a release branch, preferably the next version number (I.e., release/6.1.1xx) 
    2. Update the package.json version number (increment) 
    3. Commit and push 
    4. Create a pull request from the release branch to the master branch 
    5. Go to ci.appveyor.com and load the Agency365.search.spa project 
    6. Click the "new build" button (upper right hand corner) 
    7. Open Azure Storage Explorer 
    8. Open the cbre-search-spa folder, search for the release folder you just created (version #) 
    9. Find a previous application.min.js and copy the cache-control header, paste on the new 
    10. Set the compression header on application.min.js to gzip 
    11. Find the version.json file and manually bump the version # 
    12. Repeat steps 9-11 for each environment.  There are at least two uat enviornments.  Do the same for prod if it's going out for release.

## NOTE: THE STEPS BELOW DON'T ACTUALLY WORK, DEPRECATED

    1. Raise the version. From the root, run `./bin/version "<next version id">`. This means that `./bin/version "1.0.2"` would bump the version up to 1.0.2. This then committed and ready to push.
    2. Run `npm run grunt release`
    3. Tag and push the release in git, e.g. `git tag 1.0.2` then `git push origin 1.0.2`

## CI

### TO BE REWRITTEN

Test

    Built using AppVeyor. Published to Production blob storage (and currently the schema has to go to every environment because of CORS hell).
    https://ci.appveyor.com/project/amido/cbre-search-spa

## Testing

### Configuration Stubs

---Ignore---
To test configuration without having to interact with the back end configuration server, the application exposes it's context on `window.context`.

To inject configuration directly in to the SPA without the SPA making a call to the configuration endpoint you can call the `bootstrapConfig()` method:

`window.context.actions.bootstrapConfig({ myConfiguration: 'awesome' });`

Configuration must obviously adhere to the configuration schema:

-   Source: `./src/config/schema/master/*.json`
-   Published: `./release/config/schema.json`

### Data Stubs

Actions are not functions and their primary effect will be to yeild a side effect. Each function may yeild a side effect in a different way, e.g. dispatching an event, or invoking another function.
As such each stub needs to be implemented independently.

Actions which have stubs defined for them (see the stubs implemented in `./src/utils/getAppContext.js`) can be stubbed at any time.

To enable and disable stubs, a method `setStub(functionName: string, data: any?)` has been created on the SPA context.

#### Enable a stub

Call `setStub()` with the name of the action to stub, and the data that the stub should operate with.

e.g. `window.context.setStub('getProperties', {stubData: true});`

#### Disable a stub

Call `setStub()` with the name of the action to stub, and a `null` data parameter.

e.g. `window.context.setStub('getProperties', null);`
Or even `window.context.setStub('getProperties')`, although the former is prefered due to its expressiveness.

### [Analytics](docs/analytics.md)

### [Features](docs/features.md)
test