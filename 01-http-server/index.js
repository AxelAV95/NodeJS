const http = require('http')
const server = http.createServer((req,res)=>{
    res.end("Hellow from server")
})

server.listen(8000,"localhost", ()=>{
    console.log("Server running")
})