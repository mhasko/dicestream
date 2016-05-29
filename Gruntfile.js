module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('.aws-keys.json'), // Read the file

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['src/**/{,*/}*.js'],
                tasks: ['default' ],
            },
            html: {
                files: ['src/**/{,*/}*.html'],
                tasks: ['wiredep', 'tags', 'newer:copy:dev'],
            },
            css: {
                files: ['src/**/{,*/}*.css'],
                tasks: ['wiredep', 'tags', 'newer:copy:dev']
            },
            //jsTest: {
            //    files: ['test/spec/{,*/}*.js'],
            //    tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
            //},
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
                region: 'us-east-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },

            prod: {
                options: {
                    bucket: 'dicestream',
                    differential: true,
                },
                files: [
                    {expand: true, cwd: 'dist/public/', src: ['src/**'], dest: '/'}
                ]
            },

            publicbeta: {
                options: {
                    bucket: 'publicbetadicestream',
                    differential: true, // Only uploads the files that have changed
                },
                files: [
                    {expand: true, cwd: 'dist/publicbeta/', src: ['src/**'], dest: '/'}
                ]
            },
        },

        copy: {
            prod: {
                    files: [
                        {expand: true, cwd: '', src: ['src/**', '!src/dicestream.html', '!src/images/templates/**', '!src/images/marvel/**'], dest: 'dist/public/'}
                    ],
                    options: {
                        process: function (content, srcpath) {
                            content = content.replace(/%dicestreamhtml%/, grunt.file.read('src/dicestream.html'));
                            content = content.replace(/%whitelistpath%/, "https://s3.amazonaws.com/dicestream/**");
                            return content.replace(/%rootPath%/g,"https://s3.amazonaws.com/dicestream/src");
                        }
                    }
            },
            publicbeta: {
                files: [
                    {expand: true, cwd: '', src: ['src/**', '!src/dicestream.html', '!src/images/templates/**', '!src/images/marvel/**'], dest: 'dist/publicbeta/'}
                ],
                options: {
                    process: function (content, srcpath) {
                        content = content.replace(/%dicestreamhtml%/, grunt.file.read('src/dicestream.html'));
                        content = content.replace(/%whitelistpath%/, "https://s3.amazonaws.com/publicbetadicestream/**");
                        return content.replace(/%rootPath%/g,"https://s3.amazonaws.com/publicbetadicestream/src");
                    }
                }
            },
            dev: {
                    files: [
                        {expand: true, cwd: '', src: ['src/**', '!src/dicestream.html'], dest: '/Users/mhasko/Dropbox/Public/dicestream/dev/'}
                    ],
                    options: {
                        process: function (content, srcpath) {
                            //return content.replace(/%dicestreamhtml%/, grunt.file.read('src/dicestream.html'));
                            content = content.replace(/%dicestreamhtml%/, grunt.file.read('src/dicestream.html'));
                            content = content.replace(/%whitelistpath%/, "https://dl.dropbox.com/u/1177409/**");
                            return content.replace(/%rootPath%/g, "https://dl.dropbox.com/u/1177409/dicestream/dev/src");
                        }
                    }
            }
        },

        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all:{
                src: ['src/**/{,*/}*.js', '!Gruntfile.js', '!src/bower_components/**']
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['src/dicestream.html'],
                fileTypes: {
                    // defaults:
                    html: {
                        replace: {
                            js: '<script src="%rootPath%/{{filePath}}"></script>',
                            css: '<link rel="stylesheet" href="%rootPath%/{{filePath}}" />'
                        }
                    }
                }
            }
        },

        tags: {
            //build: {
            //    options:{
            //        scriptTemplate: '<script src="%rootPath%/{{ path }}"></script>',
            //        //linkTemplate: '<link href="%rootPath%/{{ path }}"/>',
            //    },
            //    src: [
            //        'src/**/*.js', '!src/bower_components/**'
            //    ],
            //    dest: 'src/dicestream.html'
            //}
            buildScripts: {
                options: {
                    scriptTemplate: '<script type="text/javascript" src="%rootPath%/{{ path }}"></script>',
                    openTag: '<!-- start script template tags -->',
                    closeTag: '<!-- end script template tags -->'
                },
                src: [
                    'src/**/*.js',
                    '!src/bower_components/**'
                ],
                dest: 'src/dicestream.html'
            },
            buildLinks: {
                options: {
                    linkTemplate: '<link rel="stylesheet" type="text/css" href="%rootPath%/{{ path }}" media="screen"/>',
                    openTag: '<!-- start css template tags -->',
                    closeTag: '<!-- end css template tags -->'
                },
                src: [
                    'src/**/*.css',
                    '!src/bower_components/**'
                ],
                dest: 'src/dicestream.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('codecheck', ['jscs:all']);
    grunt.registerTask('default', ['newer:jscs:all','wiredep', 'tags', 'newer:copy:dev']);
    grunt.registerTask('pbe', ['copy:publicbeta', 'aws_s3:publicbeta']);
};
