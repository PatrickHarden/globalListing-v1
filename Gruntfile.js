var pkg = require('./package');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-postcss');
    grunt.initConfig({
        eslint: {
            target: '.',
            options: {
                config: {
                    rules: {
                        'linebreak-style': 0
                    }
                }
            }
        },

        env: {
            dev: {
                NODE_ENV: 'development',
                src: 'env-dev.json'
            },
            testing: {
                NODE_ENV: 'development',
                src: 'env-testing.json'
            },
            uat_eu_north: {
                NODE_ENV: 'production',
                src: 'env-uat_eu_north.json'
            },
            uat_eu_west: {
                NODE_ENV: 'production',
                src: 'env-uat_eu_west.json'
            },
            production_eu_north: {
                NODE_ENV: 'production',
                src: 'env-production_eu_north.json'
            },
            production_eu_west: {
                NODE_ENV: 'production',
                src: 'env-production_eu_west.json'
            },
            prod: {
                NODE_ENV: 'production',
                src: 'env-dev.json'
            }
        },
        express: {
            options: {},
            dev: {
                options: {
                    script: 'src/server.js',
                    nospawn: true,
                    delay: 5
                }
            }
        },
        browserify: {
            release: {
                files: {
                    'tmp/js/application.js': ['src/utils/standalone.js']
                },
                options: {
                    debug: false,
                    alias: {
                        react: './node_modules/react',
                        'react-dom': './node_modules/react-dom'
                    },
                    transform: ['imgurify','babelify', 'packageify', 'uglifyify'],
                    browserifyOptions: {
                        paths: ['./node_modules', './src']
                    }
                }
            },
            debug: {
                files: {
                    'tmp/js/application.js': ['src/utils/standalone.js']
                },
                options: {
                    alias: {
                        react: './node_modules/react',
                        'react-dom': './node_modules/react-dom'
                    },
                    browserifyOptions: {
                        debug: true,
                        paths: ['./node_modules', './src']
                    },
                    watch: true,
                    transform: ['imgurify','babelify', 'packageify']
                }
            }
        },
        less: {
            release: {
                files: {
                    // 'tmp/css/ie9.css': 'src/public/less/ie9/main.less',
                    // 'tmp/css/whitelabel.css':
                    // 'src/public/less/whitelabel/main.less',
                    'tmp/css/cbre-commercial.css':
                        'src/public/less/themes/cbre-commercial/main.less',
                    'tmp/css/cbre-commercialv2.css':
                        'src/public/less/themes/cbre-commercialv2/main.less',
                    'tmp/css/cbre-commercialr3.css':
                        'src/public/less/themes/cbre-commercialr3/main.less',
                    'tmp/css/cbre-commercialr4.css':
                        'src/public/less/themes/cbre-commercialr4/main.less',
                    'tmp/css/cbre-residential.css':
                        'src/public/less/themes/cbre-residential/main.less',
                    
                }
            },
            options: {
                plugins: [new (require('less-plugin-npm-import'))()]
            }
        },
        css_selectors: {
            options: {
                mutations: [
                    { prefix: '.cbre-react-spa .cbre-react-spa-container' }
                ]
            },
            main: {
                files: {
                    // 'tmp/css/ie9.css': 'tmp/css/ie9.css',
                    // 'tmp/css/whitelabel.css': 'tmp/css/whitelabel.css',
                    'tmp/css/cbre-commercial.css':
                        'tmp/css/cbre-commercial.css',
                    'tmp/css/cbre-residential.css':
                        'tmp/css/cbre-residential.css',
                    'tmp/css/cbre-commercialv2.css':
                        'tmp/css/cbre-commercialv2.css',
                    'tmp/css/cbre-commercialr3.css':
                        'tmp/css/cbre-commercialr3.css',
                    'tmp/css/cbre-commercialr4.css':
                        'tmp/css/cbre-commercialr4.css'
                }
            }
        },
        postcss: {
            release: {
                options: {
                    map: false,

                    processors: [
                        require('autoprefixer')({ browsers: 'last 2 chrome versions, last 2 firefox versions, last 2 edge versions, ie 11, >1%' }),
                        require('cssnano')()
                    ]
                },
                files: {
                    // 'tmp/css/ie9.min.css': 'tmp/css/ie9.css',
                    // 'tmp/css/whitelabel.min.css': 'tmp/css/whitelabel.css',
                    'tmp/css/cbre-commercial.min.css':
                        'tmp/css/cbre-commercial.css',
                    'tmp/css/cbre-residential.min.css':
                        'tmp/css/cbre-residential.css',
                    'tmp/css/cbre-commercialv2.min.css':
                        'tmp/css/cbre-commercialv2.css',
                    'tmp/css/cbre-commercialr3.min.css':
                        'tmp/css/cbre-commercialr3.css',
                    'tmp/css/cbre-commercialr4.min.css':
                        'tmp/css/cbre-commercialr4.css'
                }
            }
        },
        uglify: {
            dev: {
                options: {
                    beautify: false,
                    ASCIIOnly: true
                },
                files: {
                    'tmp/js/application.min.js': ['tmp/js/application.js']
                }
            },
            release: {
                options: {
                    beautify: false,
                    ASCIIOnly: true,
                    mangle: true,
                    compress: false,
                    maxLineLen: 120000,
                    dead_code: true, // big one--strip code that will never execute
                    warnings: false,
                    drop_console: true
                },
                files: {
                    'release/js/application.min.js': ['tmp/js/application.js']
                }
            }
        },
        copy: {
            external: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/config/external',
                        src: '**/*',
                        dest: 'release/config/external'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/fonts/',
                        src: '**/*',
                        dest: 'release/fonts/',
                        use: 'file?name=fonts/[name].[ext]!static'
                    }
                ]
            },
            fontsLocal: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/fonts/',
                        src: '**/*',
                        dest: 'tmp/fonts/',
                        use: 'file?name=fonts/[name].[ext]!static'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/images/',
                        src: '**/*',
                        dest: 'release/images/'
                    }
                ]
            },
            js_release: {
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/js',
                        src: '**/*.min.js',
                        dest: 'release/js/'
                    }
                ]
            },
            js_debug: {
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/js/',
                        src: '**/*.js',
                        dest: 'release/js/'
                    },
                    {
                        expand: true,
                        cwd: 'public/js/',
                        src: '**/*',
                        dest: 'release/js/'
                    }
                ]
            },
            js_stubs: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/stubs/',
                        src: '**/*',
                        dest: 'release/stubs/'
                    }
                ]
            },
            styles: {
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/css/',
                        src: '**/*',
                        dest: 'release/css/'
                    }
                ]
            },
            static_css: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/public/css/',
                        src: '**/*',
                        dest: 'release/css/'
                    }
                ]
            }
        },
        clean: {
            js: ['release/', 'tmp/']
        },
        run: {
            options: {},
            npm_test: {
                cmd: 'npm',
                args: ['run', 'test', '']
            }
        },
        watch: {
            js: {
                files: ['tmp/**/*.js'],
                tasks: ['copy:js_debug'],
                options: {
                    livereload: true
                }
            },
            config: {
                files: ['src/config/**/*.json'],
                tasks: ['merge-json'],
                options: {
                    livereload: true
                }
            },
            test: {
                files: ['src/**/__tests__/**/*.js'],
                tasks: ['npm_test']
            },
            less: {
                files: ['src/public/**/*.less'],
                tasks: ['css-dev-build'],
                options: {
                    livereload: true
                }
            },
            express: {
                files: [
                    'src/server.js',
                    'src/templates/**/*.pug',
                    'src/utils/**/*.js'
                ],
                tasks: ['express:dev'],
                options: {
                    nospawn: true
                }
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/',
                        src: ['{js,css}/*'],
                        dest: 'release/gzip/'
                    }
                ]
            }
        },
        http: {
            slackbot: {
                options: {
                    url:
                        'https://amidocbre.slack.com/services/hooks/slackbot?token=1iH1mWAzYU0rL8Kk3DSNWHTR&channel=%23reactspa',
                    method: 'POST',
                    body:
                        'Version ' +
                        pkg.version +
                        ' of the SPA has been deployed by ' +
                        process.env['USER'] +
                        ' :rocket:'
                }
            }
        },
        'merge-json': {
            sample: {
                files: [
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/commercial.json',
                            'src/config/sample/overrides/commercial.json'
                        ],
                        dest: 'release/config/sample_commercial.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/commercial.json',
                            'src/config/sample/overrides/commercial_search.json'
                        ],
                        dest: 'release/config/sample_commercial_search.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential.json'
                        ],
                        dest: 'release/config/sample_residential.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential_listmap.json'
                        ],
                        dest: 'release/config/sample_residential_listmap.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential_listmap_nongeo.json'
                        ],
                        dest:
                            'release/config/sample_residential_listmap_nongeo.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential_listmap_polygons.json'
                        ],
                        dest:
                            'release/config/sample_residential_listmap_polygons.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/commercial.json',
                            'src/config/sample/overrides/commercial_flex.json'
                        ],
                        dest: 'release/config/sample_commercial_flex.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/commercial.json',
                            'src/config/sample/overrides/commercial_listmap.json'
                        ],
                        dest: 'release/config/sample_commercial_listmap.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential_boundaries.json'
                        ],
                        dest:
                            'release/config/sample_residential_boundaries.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential_search.json'
                        ],
                        dest: 'release/config/sample_residential_search.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/residential.json',
                            'src/config/sample/overrides/residential_carousel.json'
                        ],
                        dest: 'release/config/sample_residential_carousel.json'
                    },
                    {
                        src: [
                            'src/config/sample/master/*.json',
                            'src/config/sample/common/commercial.json',
                            'src/config/sample/overrides/commercial_carousel.json'
                        ],
                        dest: 'release/config/sample_commercial_carousel.json'
                    }
                ]
            },
            schema: {
                files: [
                    {
                        src: ['src/config/schema/master/*.json'],
                        dest: 'release/config/schema.json'
                    }
                ]
            }
        },
        configOverrides: [
            'carousel',
            'search',
            'commercial-carousel',
            'commercial-search'
        ]
    });

    for (var key in grunt.file.readJSON('package.json').devDependencies) {
        if (
            key !== 'grunt' &&
            key !== 'grunt-cli' &&
            key.indexOf('grunt') === 0
        ) {
            grunt.loadNpmTasks(key);
        }
    }

    // Master
    grunt.registerTask('dev', [
        'clean',
        'merge-json',
        'env:dev',
        'js-build',
        'copy:js_debug',
        'copy:external',
        'css-dev-build',
        'copy:fonts',
        'copy:images',
        'copy:js_stubs',
        'express:dev',
        'watch'
    ]);

    grunt.registerTask('build-watch', [
        'local-build',
        // 'compress',
        'watch'
    ]);
    grunt.registerTask('local-build', [
        'clean',
        // 'env:dev',
        'browserify:debug',
        'copy:js_debug',
        // 'copy:external',
        // 'copy:fonts',
        // 'copy:images'
        'css-dev-build'
    ]);

    grunt.registerTask('dev-notest', [
        'dev-build',
        'express:dev',
        'compress',
        'watch'
    ]);
    grunt.registerTask('dev-build', [
        'clean',
        // 'merge-json',
        'env:dev',
        // 'js-notest',
        // 'eslint',
        'browserify:debug',
        'copy:js_debug',
        'copy:external',
        'css-dev-build',
        'copy:fonts',
        'copy:fontsLocal',
        'copy:images',
        'copy:js_stubs'
    ]);
    grunt.registerTask('test', ['js-build']);
    grunt.registerTask('test-con', ['js-test-continuous-build']);
    grunt.registerTask('test-con-cov', ['js-test-continuous-coverage-build']);
    grunt.registerTask('release', [
        'clean:js',
        // schema
        'merge-json:schema',
        // 'env:dev', // Use dev env settings to run tests
        // javascript
        // 'eslint', //check syntax
        // 'karma:unit', // unit tests
        ////'run:npm_test', //unit tests
        'env:prod', // Switch to prod settings for final compile
        'browserify:release', // bundle
        'uglify:release', // minify
        'copy:js_release', //js
        // styles
        'less:release',
        'css_selectors',
        'postcss:release',

        'copy:styles', // build styles and post process
        // fonts
        'copy:fonts',
        // images
        'copy:images',
        // static css
        'copy:static_css',
        //manually gzip js files
        'compress' 
    ]);
    grunt.registerTask('push_all', ['push', 'push_uat', 'push_prod']);

    // Slave
    grunt.registerTask('js-build', [
        'eslint',
        //'run:npm_test',
        // 'karma:unit',
        'browserify:debug'
    ]);
    grunt.registerTask('js-test-continuous-build', [
        'eslint',
        //'run:npm_test',
        //'karma:unit',
        'browserify:debug'
    ]);
    grunt.registerTask('js-test-continuous-coverage-build', [
        'eslint',
        //'run:npm_test',
        //'karma:unit',
        'browserify:debug'
    ]);
    // grunt.registerTask('js-notest', ['eslint', 'browserify:debug']);
    grunt.registerTask('css-build', ['less', 'css_selectors', 'postcss']);
    grunt.registerTask('css-dev-build', [
        'less',
        'css_selectors',
        'postcss',
        'copy:styles'
    ]);
    grunt.registerTask('css-release', ['less', 'css_selectors', 'postcss']);
};
