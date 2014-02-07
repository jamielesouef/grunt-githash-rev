/*
 * grunt-githash-rev
 * https://github.com/jamielesouef/grunt-githash-rev
 *
 * Copyright (c) 2014 Jamie Le Souef
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;
module.exports = function(grunt) {

  grunt.registerMultiTask('githash_rev', 'Appends current commit hash to assets', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(
    {
        seperator: '-',
        hashLength: 7,
    });

    var inject = '',
        cmd  = "git rev-parse HEAD",
        done = this.async();

    exec(cmd, 
        function(error, stdout, stderr){
            if (error === null) {
                inject = options.seperator + stdout.substring(0, options.hashLength);
            } else {
                grunt.fail.warn('No hash found.. have you commited?');
            }

            console.log(inject);
          done();
        }
    )

    
  });

};
