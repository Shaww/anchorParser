module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            default: {
                files: {
                    src : ['build/**/*', 'lib/**/*']
                }
            } 
        },

        eslint: {
            es2015: {
                src : 'src/**/*.js' 
            } 
        },

        babel: {
            options: {
                sourceMap : true
            },

            normal: {
                files: [ {
                    expand  : true,
                    cwd     : 'src',
                    src     : '**/*.js',
                    dest    : 'build/'
                } ] 
            }
        },

        copy: {
          default: {
            expand  : true,
            cwd     : 'build/',
            src     : '**/*.js',
            dest    : 'lib/'
          }
        },

        watch: {
            source: {
                files : ['src/**/*.js'],
                tasks : ['clean', 'eslint', 'babel', 'copy']
            } 
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
};
