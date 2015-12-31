module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('.aws-keys.json'), // Read the file

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
                    {expand: true, cwd: 'public/src/', src: ['dicestream.xml'], dest: '/'},
                    {expand: true, cwd: 'public/src/css', src: ['**'], dest: '/src/css'},
                    {expand: true, cwd: 'public/src/js', src: ['**'], dest: '/src/js'},
                    {expand: true, cwd: 'public/src/partials', src: ['**'], dest: '/src/partials'},
                ]
            },

            publicbeta: {
                options: {
                    bucket: 'publicbetadicestream',
                    differential: true, // Only uploads the files that have changed
                },
                files: [
                    {expand: true, cwd: 'publicbeta/src/', src: ['dicestream.xml'], dest: '/'},
                    {expand: true, cwd: 'publicbeta/src/css', src: ['**'], dest: '/src/css'},
                    {expand: true, cwd: 'publicbeta/src/js', src: ['**'], dest: '/src/js'},
                    {expand: true, cwd: 'publicbeta/src/partials', src: ['**'], dest: '/src/partials'},
                ]
            },
        },

        copy: {
            prod: {
                    files: [
                        {expand: true, cwd: '', src: ['src/**'], dest: 'public/'}
                    ],
                    options: {
                        process: function (content, srcpath) {
                            return content.replace(/%rootPath%/g,"https://s3.amazonaws.com/dicestream/src");
                        }
                    }
            },
            publicbeta: {
                files: [
                    {expand: true, cwd: '', src: ['src/**'], dest: 'publicbeta/'}
                ],
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/%rootPath%/g,"https://s3.amazonaws.com/publicbetadicestream/src");
                    }
                }
            },
            dev: {
                    files: [
                        {expand: true, cwd: '', src: ['src/**'], dest: 'dev/'}
                    ],
                    options: {
                        process: function (content, srcpath) {
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
                src: ['src/js/ds{,*/}*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.registerTaks('codecheck', ['jscs:all']);
    grunt.registerTask('default', ['copy:dev']);
    grunt.registerTask('pbe', ['copy:publicbeta', 'aws_s3:publicbeta']);
};