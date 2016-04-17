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
	grunt.loadNpmTasks('grunt-npm2bower-sync'); // sync

	// Register the tasks
	grunt.registerTask('test', ['eslint']);
	grunt.registerTask('default', ['sync', 'test']);

};
