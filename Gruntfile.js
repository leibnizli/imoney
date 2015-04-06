module.exports = function(grunt) {

    // 构建任务配置
    grunt.initConfig({
        //读取package.json的内容，形成个json数据
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            src: 'src/lib',
            //dest: 'dist/<%= pkg.name %>/<%= pkg.version %>',
            dest: 'build',
        },
        //js压缩
        uglify: {
            //文件头部输出信息
            options: {
                banner: '/**\n * Name: <%= pkg.name %> <%= pkg.version %>\n * Author: <%= pkg.author %>\n * Url: <%= pkg.url%>\n * Time: <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %> \n*/\n',
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },

            //具体任务配置
            build: {
                files: {
                    '<%= dirs.dest %>/imoney.min.js': ['<%= dirs.src %>/imoney.js']
                }
            }
        }

    });

    //载入插件
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //注册任务
    //只需在命令行上输入"grunt"，就会执行default task
    grunt.registerTask('default', ['uglify']);
};