/*
 * grunt-githash-rev
 * https://github.com/jamielesouef/grunt-githash-rev
 *
 * Copyright (c) 2014 Jamie Le Souef
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;
var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('githashrev', 'Appends current commit hash to assets', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        seperator: '-',
        hashLength: 10,
        indexFile: false
    });


    var inject,
        indexContent,
        cmd  = "git rev-parse HEAD",
        done = this.async();

    var addGitHashTo = function(filePath) {
        var file = {
            path: filePath,
            dirname: path.dirname(filePath),
            basename: path.basename(filePath),
            ext : path.extname(filePath),
            contents : grunt.file.read(filePath),
            savefilename: function() {
                return [
                    file.basename.replace(path.extname(filePath),''),
                    inject,
                    file.ext
                    ].join('');
            },
            savename: function() {
                return [
                    file.dirname,
                    '/',
                    this.savefilename()].join('');
            }
        };
        //write new files
        grunt.file.write(file.savename(), file.contents);
        grunt.file.delete(filePath);

        //modify index content
        
        if (options.indexFile) {
            indexContent = indexContent.replace(file.basename, file.savefilename());
        }
    };

     // find index file and linked JS and CSS assets
    var addToContent = function(){

        if (options.indexFile) {
            indexContent = grunt.file.read(options.indexFile);
        }

        this.files.forEach(function(file) {

            var contents = file.src.filter(function(filePath){
                if(grunt.file.exists(filePath)){
                    return true;
                } else {
                    this.grunt.fail.warn('Source ' + filePath + ' not found.');
                    return false;
                }
            }).map(function(filePath) {
                addGitHashTo(filePath);
            });
        });
    }.bind(this);

    //get the git hash
    exec(cmd, 
        function(error, stdout, stderr){
            if (error === null) {
                inject = options.seperator + stdout.substring(0, options.hashLength);
                addToContent();
                if (options.indexFile) {
                    grunt.file.write(options.indexFile, indexContent);
                }
            } else {
                grunt.fail.warn('No hash found.. have you commited?');
            }
            //write index file
            
            done();
        }
    );
    
  });

};
