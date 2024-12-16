const express = require('express')
const path = require("path")

const app = express()
const port = 3000

app.set('view engine','hbs')
app.set("views", path.join(__dirname))

app.use('./assets',express.static(path.join(__dirname,"./assets")))

app.get('/', (request,response) => {
response.render('index')
})

app.get ("/contact",(req,res)=>{
    res.send("halaman contact form")
})

app.get ("/project/",(req,res)=>{
    res.send("halaman project")
})

app.get ("/:lang/project/:id",(req,res)=>{
    const {id,lang} = req.params
    const {name, title} = req.query

    let textToRender = ""
    res.send(`halaman project ${id} ; author : ${name} title: ${title}`)
})

app.listen(port, () => {
    console.log(`server berjalan di port${port}`)
})