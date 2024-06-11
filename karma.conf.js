module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'browserify', 'mocha'],

        // list of files / patterns to load in the browser
        files: [
            'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
            'https://maps.googleapis.com/maps/api/js?libraries=places',
            'test/gmap-mock.js',
            'src/**/__tests__/*.js'
        ],

        plugins: [
            'karma-jasmine',
            'karma-browserify',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-chrome-launcher'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/__tests__/*.js': ['browserify', 'coverage']
        },

        coverageReporter: {
            // type of file to output, use text to output to console
            type: 'text',
            // directory where coverage results are saved
            dir: 'test-results/coverage/'
            // if type is text or text-summary, you can set the file name
            // file: 'coverage.txt'
        },

        browserify: {
            debug: true,

            transform: ['babelify'],
            // don't forget to register the extensions
            extensions: ['.js', '.jsx', '.coffee']
        },

        reporters: ['progress'],

        // web server port
        port: 3333,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        browsers: ['HeadlessChrome'],
        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
