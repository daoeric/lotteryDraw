const utils=require('./utils/utils');
module.exports = {
   //baseUrl: './',  // 配置基本url
   publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
   // 输出文件目录
   outputDir: 'lucky',
    devServer: {
        allowedHosts: [
            'b.test.com',  // 允许通过 b.test.com 访问
            'a.test.com',
            'localhost',   // 也允许 localhost
            '127.0.0.1'    // 允许 127.0.0.1
        ],
    },
   pages:{
   	index:{
   		entry:'src/pages/index/index.js',
   		template:'src/pages/index/index.html',
   		filename:'index.html',
   	},
   	rule:{
   		entry:'src/pages/rule/rule.js',
   		template:'src/pages/rule/rule.html',
   		filename:'rule.html',
   	},
   	myAward:{
   		entry:'src/pages/myAward/myAward.js',
   		template:'src/pages/myAward/myAward.html',
   		filename:'myAward.html',
   	}
   },
   css: {
          loaderOptions: {
            css: {},
            postcss: {
              plugins: [
                require('autoprefixer'),
                require('postcss-px2rem')({
                  remUnit: 37.5
                })
             ]
           }
         }
     }
}
