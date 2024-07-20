const http = require('http')
const server = http.createServer((req,res)=>{
   

    if(req.url === "/mangas"){
        res.end("These are mangas")
    }else if(req.url === "/animes"){
        res.end("These are animes")
    }else{
        res.end("Hellow from server")
    }

    
})

server.listen(8000,"localhost", ()=>{
    console.log("Server running")
})