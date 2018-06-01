//------------------------------
// Web Sever of Article Map
//------------------------------

const fs = require('fs')
const pathFn = require('path')
let bodyParser = require('body-parser')
let express = require('express')
let builder = require('./show-article-map-builder.js')
let app = express()
const rootDir = process.env.PWD || process.cwd()


builder.build().then( (inArgs) => {
    
    const port = inArgs[0]
    const articleMapData = inArgs[1]
    
    app.use(bodyParser.json())
    app.use("/asset", express.static( pathFn.join( __dirname , '/article-map-template/')))
    app.use("/article-map-data.js", express.static( articleMapData ))

    app.get('/', (req, res) => {
        let rData = fs.readFileSync( pathFn.join( __dirname , '/article-map-template/index.html' ), 'utf-8')
        contentType = "text/html"
        res.writeHead( 200 , {
            "Content-Type" : contentType,
            "Access-Control-Allow-Origin" : "*",
            "Pragma": "no-cache" ,
            "Cache-Control" : "no-cache"
        })
        res.end(rData)
    })
    
    app.listen(port)
    console.log(`Please open \u001b[32mlocalhost:${port}\u001b[0m in your browser.`)
            
    return new Promise((resolve, reject) => {
        resolve()
    })
})


    