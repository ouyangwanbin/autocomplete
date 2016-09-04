module.exports = function(grunt) {
    //Configuration
    grunt.initConfig({
        clean: ["dist/*"],
        uglify: {
            my_target: {
                files: {
                    'dist/js/app.min.js': ['scripts/autocomplete.js'],
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ['css/*.css'],
                    dest: 'dist',
                    ext: '.min.css'
                }]
            }
        }
    });

    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Register Tasks
    grunt.registerTask('default', ['clean', 'uglify', 'cssmin']);
}