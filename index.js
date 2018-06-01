if(!(hexo.config.seoLinkVisualizer && !hexo.config.seoLinkVisualizer.enable)){
    
    hexo.extend.filter.register('after_init' , () => {
        require('./lib/loadCache')(hexo)
    })
    
    hexo.extend.filter.register('after_post_render', ( post ) => {
        return require('./lib/analyzer')(post, hexo)
    }, { async: true })

    hexo.extend.filter.register('after_generate', () => {
        return require('./lib/cache')(hexo)
    })
}