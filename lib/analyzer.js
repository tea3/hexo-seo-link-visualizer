const cheerio = require('cheerio')
const temp = require('./temp.js')

module.exports = (inPost, inHexo) => {
    return analyze_link({hexo: inHexo, post: inPost})
        .then((inArgs) => {
            return new Promise((resolve, reject) => {
                resolve(inArgs.post)
            })
        })
}


let analyze_link = (inArgs) => {
    $ = cheerio.load(inArgs.post.content)
    if( isAllowedSourcePath( inArgs.hexo, inArgs.post.source )){
      temp.clearLinks( inArgs.hexo , inArgs.post )
      $("a").each(function(i){
        const hrefStr = $(this).attr("href")
        const post_cat = getGategories( inArgs.post , inArgs.hexo )
        
        if(hrefStr.match(/^\#/)){
          // toc link
          if( isAllowLink( inArgs.hexo , 'toc' , $(this).attr("href") )){
                temp.saveToc( inArgs.hexo , 
                    inArgs.post.title ,
                    inArgs.post.source ,
                    inArgs.post.path ,
                    post_cat ,
                    $(this).attr("href")
                )
          }
        }else if(hrefStr.match(/^\//) || hrefStr.match(/^\./) || hrefStr.indexOf(inArgs.hexo.config.url.replace(/(http\:\/\/|https\:\/\/)/ , "")) != -1 ){
          // internal link
          if( isAllowLink( inArgs.hexo , 'int' , $(this).attr("href") )){
              temp.saveInternal( inArgs.hexo , 
                    inArgs.post.title ,
                    inArgs.post.source ,
                    inArgs.post.path ,
                    post_cat ,
                    $(this).attr("href")
              )
          }
        }else{
          // external link
          if( isAllowLink( inArgs.hexo , 'ext' , $(this).attr("href") )){
              temp.saveExternal( inArgs.hexo , 
                    inArgs.post.title ,
                    inArgs.post.source ,
                    inArgs.post.path ,
                    post_cat ,
                    $(this).attr("href")
              )
          }
        }
      })
    }
    
    return new Promise((resolve, reject) => {
        resolve({
            post: inArgs.post
        })
    })
}

let isAllowedSourcePath = ( inHexo , inPath ) => {
    if( !inHexo.config.seoLinkVisualizer || !inHexo.config.seoLinkVisualizer.allowedSourcePath ){
        return true
    }else{
        let isPermission = false
        for(let sp of inHexo.config.seoLinkVisualizer.allowedSourcePath ){
            if( inPath.indexOf( sp ) != -1){
                isPermission = true
                return true
            }
        }
        return isPermission
    }
}

let isAllowLink = ( inHexo , linkType , inPath ) => {
    if( !inHexo.config.seoLinkVisualizer || !inHexo.config.seoLinkVisualizer.ignoreLink ){
        return true
    }else{
        let isPermission = true
        if( inHexo.config.seoLinkVisualizer.ignoreLink && inHexo.config.seoLinkVisualizer.ignoreLink[linkType] ){
            for(let sp of inHexo.config.seoLinkVisualizer.ignoreLink[linkType] ){
                if( inPath.indexOf( sp ) != -1){
                    isPermission = false
                    return false
                }
            }
        }
        return isPermission
    }   
}

let getGategories = (inPost, inHexo) => {
    if( inPost.categories && inPost.categories.length ){
        let categoryName = ''
        const categoryDepthLimits = (inHexo.config.seoLinkVisualizer && inHexo.config.seoLinkVisualizer.categoryDepthLimits) ? inHexo.config.seoLinkVisualizer.categoryDepthLimits : 1
        let catDepth = 1
        for(let cd of inPost.categories.data ){
            if( categoryDepthLimits > 0 && catDepth > categoryDepthLimits ) break
            categoryName += (categoryName == '' ? '' : ' > ') + cd.name
            catDepth++
        }
        return categoryName
    }else{
        return 'none'
    }
}