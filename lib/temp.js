module.exports.saveToc = ( hexo , title , source , path , categories , url ) => {
    initTEMP( hexo )
    margeLinks( hexo , "toc" , {
        title: title ,
        source: source ,
        path: path ,
        category: categories ,
        links: {
            int: [] ,
            ext: [] ,
            toc: [ url ] ,
        }
    } )
}

module.exports.saveInternal = ( hexo , title , source , path , categories , url ) => {
    initTEMP( hexo )
    margeLinks( hexo , "int" , {
        title: title ,
        source: source ,
        path: path ,
        category: categories ,
        links: {
            int: [ url ] ,
            ext: [] ,
            toc: [] ,
        }
    } )
}

module.exports.saveExternal = ( hexo , title , source , path , categories , url ) => {
    initTEMP( hexo )
    margeLinks( hexo , "ext" , {
        title: title ,
        source: source ,
        path: path ,
        category: categories ,
        links: {
            int: [] ,
            ext: [ url ] ,
            toc: [] ,
        }
    } )
}

module.exports.clearLinks = ( hexo ,insertData ) => {
    let temp = hexo.config.seoLinkVisualizer.tmp
    for(let i=0; i<temp.length; i++){
        if(temp[i].path == insertData.path ){
            temp[i].links.int = []
            temp[i].links.ext = []
            temp[i].links.toc = []
            break
        }
    }
    hexo.config.seoLinkVisualizer.tmp = temp
}


let initTEMP = ( hexo ) => {
    if( !hexo.config.seoLinkVisualizer){
        hexo.config.seoLinkVisualizer = {}
    }
    if( !hexo.config.seoLinkVisualizer.tmp ){
        hexo.config.seoLinkVisualizer.tmp = []
    }
}

let margeLinks = ( hexo , linkType , insertData ) => {
    let temp = hexo.config.seoLinkVisualizer.tmp
    let isMatch = false
    for(let i=0; i<temp.length; i++){
        if(temp[i].path == insertData.path ){
            if(linkType == "int"){
                temp[i].links.int.push(insertData.links.int[0])
            }else if(linkType == "ext"){
                temp[i].links.ext.push(insertData.links.ext[0])
            }else if(linkType == "toc"){
                temp[i].links.toc.push(insertData.links.toc[0])
            }
            isMatch = true
        }
    }
    if(!isMatch){
        temp.push({
            title: insertData.title ,
            source: insertData.source ,
            path: insertData.path ,
            category: insertData.category ,
            links: {
                int: insertData.links.int ,
                ext: insertData.links.ext ,
                toc: insertData.links.toc ,
            }
        })
    }
    hexo.config.seoLinkVisualizer.tmp = temp
}
