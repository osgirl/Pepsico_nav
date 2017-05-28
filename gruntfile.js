module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    //list the js files in the order 
                    'public/js/script.js': ['public/_/components/js/*.js']
                } //files
            } //my_target
        }, //uglify
        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                } //options
            } //dev
        }, //compass
        watch: {
            options: { livereload: true },
            scripts: {
                files: ['public/_/components/js/*.js'],
                tasks: ['uglify']
            }, //script
            sass: {
                files: ['public/_/components/sass/*.scss'],
                tasks: ['compass:dev']
            }, //sass
            html: {
                files: ['views/*.html']
            }
        } //watch
    }) //initConfig
    grunt.registerTask('default', 'watch');
} //exportsrts