const pathFn = require('path')
const fs = require('hexo-fs')
const mkdirp = require('mkdirp')

module.exports = ( inHexo ) => {
    return saveCache( inHexo )
        .then((inArgs) => {
            return new Promise((resolve, reject) => {
                resolve()
            })
        })
}

let saveCache = ( inHexo ) => {    
    const cache_path = pathFn.join(process.env.PWD || process.cwd(), (!inHexo.config.seoLinkVisualizer || !inHexo.config.seoLinkVisualizer.cache ? 'cache-seo-link-visualizer.json' : inHexo.config.seoLinkVisualizer.cache ))
    mkdirp.sync( pathFn.dirname( cache_path ))
    fs.writeFileSync( cache_path, JSON.stringify({
        list: inHexo.config.seoLinkVisualizer.tmp ,
        port: (!inHexo.config.seoLinkVisualizer || !inHexo.config.seoLinkVisualizer.port) ? '1234' : inHexo.config.seoLinkVisualizer.port ,
        previewHost: (!inHexo.config.seoLinkVisualizer || !inHexo.config.seoLinkVisualizer.port) ? 'localhost:4000/' : inHexo.config.seoLinkVisualizer.previewHost ,
    }))
    
    return new Promise((resolve, reject) => {
        resolve()
    })
}