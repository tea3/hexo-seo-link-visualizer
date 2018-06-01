//------------------------------
// Show Article Map Builder
//------------------------------

let fs = require('fs')
let pathFn = require('path')
let yaml = require('js-yaml')
let categories = []

module.exports.build = () => {
    return importHexoConfig()
        .then( importFileToJson )
        .then( generateLabel )
        .then( generateRoot )
        .then( writeJsFile )
        .then((inArgs) => {
            const port = inArgs[3]
            const articleMapData = inArgs[4]
            return new Promise((resolve, reject) => {
                resolve([port, articleMapData])
            })
        })
}


let importHexoConfig = () =>
  new Promise( (resolve , reject) => {
    try {
        const rootDir = process.env.PWD || process.cwd()
        const doc = yaml.safeLoad( fs.readFileSync( pathFn.join( rootDir , '_config.yml' ), 'utf8'))
        const cachePath = pathFn.join( rootDir , (!doc.seoLinkVisualizer || !doc.seoLinkVisualizer.cache) ? 'cache-seo-link-visualizer.json' : doc.seoLinkVisualizer.cache )
        resolve( [cachePath] )
    } catch (e) {
        reject( new Error(e) )
    }
  })
  

let importFileToJson = ( inArgs ) =>
  new Promise( (resolve , reject) => {
    try {
      const doc = fs.readFileSync( inArgs[0] , 'utf8')
      let jsn = JSON.parse(doc) 
      
      resolve( [jsn.list , jsn.port, jsn.previewHost , inArgs[0] ] )
    } catch (e) {
      reject( new Error(e) )
    }
  })
  
  
let generateLabel = ( inArgs ) =>
  new Promise( (resolve , reject) => {
    let nodes_data = []
    let links_data = []
    let jsn = inArgs[0]
    let index = 1
    for(let pst of jsn ){
        nodes_data.push( {
            id: index ,
            label: pst.path ,
            tit: pst.title ,
            source: pst.source ,
            intLink: pst.links.int ,
            group: getGroup( pst.category )
        } )
        links_data.push( {
            id: index ,
            links: {
                int: {
                    in: [],
                    out: pst.links.int
                },
                ext : pst.links.ext ,
                toc : pst.links.toc
            }
        } )
        index++
    }
    resolve( [nodes_data , links_data , inArgs[1] , inArgs[2] , inArgs[3] ] )
  })
  
let generateRoot = ( inArgs ) =>
  new Promise( (resolve , reject) => {
    let edges_data = []
    let nodes = inArgs[0]
    let links = inArgs[1]
    for(let nd of nodes ){
        for(let nd2 of nodes ){
            for(let ilnk of nd2.intLink ){
                if(nd.label == ilnk.replace(/^\// , "")){
                    if( !isDupplicate( nd2.id , nd.id , edges_data ) ){
                        edges_data.push({
                            from: nd2.id , to: nd.id
                        })
                        let lkid = 0
                        for(let lk of links){
                            if(lk.id == nd.id){
                                links[lkid].links.int.in.push( nd2.label )
                            }
                            lkid++
                        }
                    }
                }
            }
        }
    }
    resolve( [nodes, edges_data, links , inArgs[2] , inArgs[3] , inArgs[4] ] )
  })
  
let isDupplicate = ( inFrom , inTo , inEdges ) => {
    let isMatched = false
    if(inFrom == inTo)return true
    for(let ed of inEdges){
        if( ed.from == inFrom && ed.to == inTo ){
            isMatched = true
            return true
        }
    }
    return isMatched
}


let writeJsFile = ( inArgs ) =>
    new Promise( (resolve , reject) => {
        
    let nodes = inArgs[0]
    let edges = inArgs[1]
    let links = inArgs[2]
    const port = inArgs[3]
    const previewHost = inArgs[4]
    const cacheDir = pathFn.dirname(inArgs[5])
    
    const nodes_str = JSON.stringify(nodes)
    const edges_str = JSON.stringify(edges)
    const links_str = JSON.stringify(links)
    
    const outCode = `const NODES_DATA = ${nodes_str} \r\n\r\n const EDGES_DATA = ${edges_str} \r\n\r\n const links_data = ${links_str} \r\n\r\n const PREVIEW_HOST = '${previewHost}' \r\n\r\n `
    
    const articleMapData = pathFn.join(cacheDir , 'article-map-data.js')
    fs.writeFileSync( articleMapData, outCode )
    
    resolve( [nodes, edges, links , port, articleMapData] )
  })
 
 
let getGroup = ( inCategory ) => {
    let ind = 1
    for(let cat of categories){
        if(cat == inCategory){
            return `c${ind}`
        }
        ind++
    }
    // console.log(`Category Color Id: ${ind}`)
    categories.push(inCategory)
    return `c${ind}`
  } 
