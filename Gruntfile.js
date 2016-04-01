module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            default: {
                files: {
                    src: 'build/**/*' 
                }
            } 
        },

        eslint: {
            es2015: {
                src: 'src/**/*.js' 
            } 
        },

        babel: {
            options: {
                sourceMap: true
            },

            normal: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'build/'
                }] 
            }
        },

        watch: {
            source: {
                files: ['src/**/*.js'],
                tasks: ['clean', 'eslint', 'babel']
            } 
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['watch']);
};
