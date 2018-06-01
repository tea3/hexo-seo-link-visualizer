const pathFn = require('path')
const fs = require('fs')

module.exports = ( inHexo ) => {
    return loadCacheAndSet( inHexo )
        .then((inArgs) => {
            return new Promise((resolve, reject) => {
                resolve( inArgs.hexo )
            })
        })
}

let loadCacheAndSet = ( inHexo ) => {    
    if(!inHexo.config.seoLinkVisualizer.tmp){   
        const cache_path = pathFn.join(process.env.PWD || process.cwd(), (!inHexo.config.seoLinkVisualizer || !inHexo.config.seoLinkVisualizer.cache ? 'cache-seo-link-visualizer.json' : inHexo.config.seoLinkVisualizer.cache ))
        fs.access( cache_path , e => {
            if(!e){
                inHexo.config.seoLinkVisualizer.tmp = JSON.parse( fs.readFileSync( cache_path, 'utf-8') )['list']
                console.log("\r\n\r\nload Cache File!!!\r\n\r\n")
            }else{
                inHexo.config.seoLinkVisualizer.tmp = []
            }
        })   
    }
    
    return new Promise((resolve, reject) => {
        resolve( {hexo: inHexo} )
    })
}