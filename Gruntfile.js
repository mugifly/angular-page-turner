module.exports = function(grunt) {

	grunt.initConfig({

		// Package information
		pkg: '<json:package.json>',

		// Linter
		eslint: {
			src: [
				'.'
			]
		},

		// Testing
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			},
			unitAtOnce: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		// Sync the manifest for bower.json
		sync: {
			all: {
				options: {
					sync: ['name', 'author', 'version', 'description', 'private', 'license', 'homepage', 'keywords']
				}
			}
		}

	});

	// Load the modules
	grunt.loadNpmTasks('gruntify-eslint'); // eslint
	grunt.loadNpmTasks('grunt-karma'); // karma
	grunt.loadNpmTasks('grunt-npm2bower-sync'); // sync

	// Register the tasks
	grunt.registerTask('dev', ['eslint', 'karma:unit']);
	grunt.registerTask('test', ['eslint', 'karma:unitAtOnce']);
	grunt.registerTask('default', ['sync', 'test']);

};
