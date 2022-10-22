module.exports = {
    devServer: {
        host:"localhost",
        proxy:{
            '/api': {
                target: 'http://106.ihuyi.com',
                ws: true,
                changeOrigin: true,
                pathRewrite:{
                    '^/api':''
                }
            },
            '/books':{
                target: 'http://106.ihuyi.com',
                ws: true,
                changeOrigin: true,
                pathRewrite:{
                    '^/api':'https://api.jike.xyz'
                }
            },
            '/node': {
                target: 'http://localhost:4000',
                ws: true,
                changeOrigin: true,
                pathRewrite:{
                    '^/node':''
                }
            },
        }
    } 
}