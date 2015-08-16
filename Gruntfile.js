module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: {
                files: [
                    {expand: true, cwd: '', src: ['src/**'], dest: 'public/'}
                ],
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/%rootPath%/g,"https://dl.dropbox.com/u/1177409/dicestream/public/src");
                    }
                }
                //src: 'src/**',
                //dest: 'public/'
            }
        }

        //express: {
        //
        //    options: {
        //        port: 9000,
        //        serverreload: true
        //    },
        //
        //    dev: {
        //        options: {
        //            bases: [
        //                'public',
        //                'public/templates' /* [1] */
        //            ]
        //        }
        //    },
        //
        //    prod: {
        //        options: {
        //            bases: [
        //                '.public',
        //                '.public/templates' /* [1] */
        //            ]
        //        }
        //    }
        //},

        //karma: {
        //
        //    options: {
        //        frameworks: ['mocha', 'chai'],
        //        reporters: ['spec'],
        //        files: [
        //            { pattern: 'public/components/**/*.js', included: false },
        //            { pattern: 'public/js/**/*.js', included: false },
        //            { pattern: 'test/browser/utils.js', included: false },
        //            { pattern: 'test/browser/unit/**/*.js', included: false },
        //            'test/browser/main.js'
        //        ]
        //    },
        //
        //    unit: {
        //        options: {
        //            port: 9999,
        //            browsers: ['PhantomJS'],
        //            autoWatch: false,
        //            singleRun: true
        //        }
        //    }
        //
        //    /*integration: {
        //        ...
        //    }*/
        //}
    });

    //grunt.loadNpmTasks('grunt-express');
    //grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Define your tasks here
    grunt.registerTask('default', ['copy']);
};

// [1] Not using server-side controllers in order to simplify things
