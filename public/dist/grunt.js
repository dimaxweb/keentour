//        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +

//        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'

module.exports=function(e){e.initConfig({min:{dist:{src:"../js/src/*.js",dest:"../dist/*.js"}},qunit:{files:["test/unit/all.html"]},lint:{files:["grunt.js","js/*.js","test/unit/*.js"]},watch:{files:"<config:lint.files>",tasks:"lint qunit"},jshint:{options:{curly:!0,eqeqeq:!0,immed:!0,latedef:!0,newcap:!0,noarg:!0,sub:!0,undef:!0,boss:!0,eqnull:!0,browser:!0},globals:{jQuery:!0}},uglify:{},concat:{dist:{src:["<banner:meta.banner>","<file_strip_banner:src/<%= pkg.name %>.js>"],dest:"dist/<%= pkg.name %>.js"}}}),e.registerTask("default","min")}