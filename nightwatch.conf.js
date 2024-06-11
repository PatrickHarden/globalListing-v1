//require('env2')('.env'); // optionally store your Evironment Variables in .env
const SCREENSHOT_PATH = './screenshots/';
const BINPATH = './node_modules/nightwatch/bin/';

// we use a nightwatch.conf.js file so we can include comments and helper functions
module.exports = {
    src_folders: [
        'test/e2e/tests' // Where you are storing your Nightwatch e2e tests
    ],
    output_folder: './reports', // reports (test outcome) output by nightwatch
    page_objects_path: 'test/e2e/pages',
    selenium: {
        // downloaded by selenium-download module (see readme)
        start_process: true, // tells nightwatch to start/stop the selenium process
        server_path: './node_modules/nightwatch/bin/selenium.jar',
        host: '127.0.0.1',
        port: 4444, // standard selenium port
        cli_args: {
            // chromedriver is downloaded by selenium-download (see readme)
            'webdriver.chrome.driver':
                './node_modules/nightwatch/bin/chromedriver'
        }
    },
    test_settings: {
        default: {
            launch_url: 'http://cbre-commercial.ami/en-GB',
            languagePack: '../../language/en-gb',
            screenshots: {
                enabled: true, // if you want to keep screenshots
                path: './screenshots/', // save screenshots here
                on_failure: true,
                on_error: true
            },
            globals: {
                waitForConditionTimeout: 10000 // sometimes internet is slow so wait.
            },
            desiredCapabilities: {
                // use Chrome as the default browser for tests
                browserName: 'chrome'
            }
        },
        'Local-UK-Residential': {
            launch_url: 'http://cbre.ami/en-GB',
            languagePack: '../../siteConfig/Local-UK-Residential',
            screenshots: {
                path: './screenshots/Local-UK-Residential/'
            }
        },
        'UAT-UK-Residential': {
            launch_url: 'https://uat.cbreresidential.com/uk/en-GB/',
            languagePack: '../../siteConfig/UAT-UK-Residential',
            screenshots: {
                path: './screenshots/UAT-UK-Residential/'
            }
        },
        'PROD-UK-Residential': {
            launch_url: 'https://www.cbreresidential.com/uk/en-GB/',
            languagePack: '../../siteConfig/PROD-UK-Residential',
            screenshots: {
                path: './screenshots/PROD-UK-Residential/'
            }
        },
        'Local-UK-Commercial': {
            launch_url: 'http://cbre-commercial.ami/en-GB',
            languagePack: '../../siteConfig/Local-UK-Commercial',
            screenshots: {
                path: './screenshots/Local-UK-Commercial/'
            }
        },
        'UAT-UK-Commercial': {
            launch_url: 'https://uat.commerciallistings.cbre.co.uk/en-GB/',
            languagePack: '../../siteConfig/Local-UK-Commercial',
            screenshots: {
                path: './screenshots/UAT-UK-Commercial/'
            }
        },
        'PROD-UK-Commercial': {
            launch_url: 'https://www.commerciallistings.cbre.co.uk/en-GB/',
            languagePack: '../../siteConfig/PROD-UK-Commercial',
            screenshots: {
                path: './screenshots/PROD-UK-Commercial/'
            }
        },
        'PROD-DE-Commercial': {
            launch_url:
                'https://www.gewerbeimmobilien.cbre.de/de-DE/listings/bueroimmobilien/search',
            languagePack: '../../siteConfig/PROD-DE-Commercial',
            screenshots: {
                path: './screenshots/PROD-DE-Commercial/'
            }
        },
        'UAT-DE-Commercial': {
            launch_url:
                'https://uat.gewerbeimmobilien.cbre.de/de-DE/listings/bueroimmobilien/search',
            languagePack: '../../siteConfig/UAT-DE-Commercial',
            screenshots: {
                path: './screenshots/UAT-DE-Commercial/'
            }
        }
    }
};
/**
 * selenium-download does exactly what it's name suggests;
 * downloads (or updates) the version of Selenium (& chromedriver)
 * on your localhost where it will be used by Nightwatch.
 /the following code checks for the existence of `selenium.jar` before trying to run our tests.
 */

require('fs').stat(BINPATH + 'selenium.jar', function(err, stat) {
    // got it?
    if (err || !stat || stat.size < 1) {
        require('selenium-download').ensure(BINPATH, function(error) {
            // Currently trying to pull "4.0/selenium-server-standalone-4.0.0.jar"
            // This does not exist.
            // Must be either:
            // "4.0/selenium-server-standalone-4.0.0-alpha-1.jar" OR
            // "4.0/selenium-server-standalone-4.0.0-alpha-2.jar"
            if (error) throw new Error(error); // no point continuing so exit!
        });
    }
});

function padLeft(count) {
    // theregister.co.uk/2016/03/23/npm_left_pad_chaos/
    return count < 10 ? '0' + count : count.toString();
}

var FILECOUNT = 0; // 'global' screenshot file count
/**
 * The default is to save screenshots to the root of your project even though
 * there is a screenshots path in the config object above! ... so we need a
 * function that returns the correct path for storing our screenshots.
 * While we're at it, we are adding some meta-data to the filename, specifically
 * the Platform/Browser where the test was run and the test (file) name.
 */
function imgpath(browser) {
    var a = browser.options.desiredCapabilities;
    var meta = [a.platform];
    meta.push(a.browserName ? a.browserName : 'any');
    meta.push(a.version ? a.version : 'any');
    meta.push(a.name); // this is the test filename so always exists.
    var metadata = meta
        .join('~')
        .toLowerCase()
        .replace(/ /g, '');
    return SCREENSHOT_PATH + metadata + '_' + padLeft(FILECOUNT++) + '_';
}

module.exports.imgpath = imgpath;
module.exports.SCREENSHOT_PATH = SCREENSHOT_PATH;
