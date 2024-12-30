const {Sequelize, QueryTypes} = require("sequelize")
const config = require("../config/config.json")

const sequelize = new Sequelize(config.development)

function renderHome (req,res){
    res.render("index",{isHome : true})
}
function renderContact(req,res){
    res.render("task-form")
}



async function renderProject(req,res){

    const query =`SELECT * FROM public."Blogs"
                    ORDER BY "createdAt" DESC
    `
    const project = await sequelize.query(query, {type: QueryTypes.SELECT })
// const blogs=await blog.findAll({
//     order: [["createdAt","DESC"]]
// })
    console.log(project)

    res.render("MyProject",{project:project,isMyProject:true})
}
async function renderProjectDetail(req,res){
    const {id} = req.params

const query =`SELECT *FROM public."Blogs" WHERE id = ${id}`
const detail = await sequelize.query(query,{type: QueryTypes.SELECT})
const formattedData = {...detail[0], 
    start : new Date(detail[0].start).toISOString().split('T')[0],
    end : new Date(detail[0].end).toISOString().split('T')[0]
}
// const projectDetail = await blog.findOne({where:{id:id}})

    res.render("projectDetail",{data : formattedData })
}

async function addProject(req,res){
console.log("form submited")

const {title,content,start,end,icon}=req.body
const icons=Array.isArray(icon) ? icon : [icon]
const formattedIcons =`{${icons.join(",")}}`
let durationInMonth=Math.floor((new Date(end)-new Date(start))/(1000*60*60*24*30))
let durationInDay=Math.floor((new Date(end)-new Date (start))/(1000*60*60*24))
let duration
if (durationInMonth>0){
    duration=`${durationInMonth} Month${durationInMonth > 1 ? "s" : ""} `
}
else{duration=`${durationInDay} Day${durationInDay > 1 ? "s": ""}`}


const image = "https://picsum.photos/200/300"

const query =` INSERT INTO public."Blogs"
               (title,content,image,start,"end",duration,icons)  
               VALUES 
               ($1,$2,'${image}','${start}','${end}','${duration}','${formattedIcons}') ` 
 
const result = await sequelize.query(query,{type: QueryTypes.INSERT,
    bind:[title,content]
})

console.log(result) 

res.redirect('/MyProject')
}


// RATING
function renderRating(req,res){
    res.render("rating",{isRating : true})
}

function renderMyProjectAdd(req,res){
    res.render("my-project-add")
}

async function updateProject(req,res){
    console.log("form submited")
   const {id} = req.params
    const {title,content,start,end,icon}=req.body
    const icons=Array.isArray(icon) ? icon : [icon]
    const formattedIcons =`{${icons.join(",")}}`
    let durationInMonth=Math.floor((new Date(end)-new Date(start))/(1000*60*60*24*30))
    let durationInDay=Math.floor((new Date(end)-new Date (start))/(1000*60*60*24))
    let duration
    if (durationInMonth>0){
        duration=`${durationInMonth} Month${durationInMonth > 1 ? "s" : ""} `
    }
    else{duration=`${durationInDay} Day${durationInDay > 1 ? "s": ""}`}
    
    
    const image = "https://picsum.photos/200/300"
    
    const query =` UPDATE public."Blogs"
                    SET
                    title = $1,
                    content = $2,
                    image = '${image}',
                    start = '${start}',
                    "end" = '${end}',
                    duration = '${duration}',
                    icons = '${formattedIcons}'
                    WHERE id = ${id}
                   ` 
     
    const result = await sequelize.query(query,{type: QueryTypes.UPDATE,bind:[title,content]})
    
    console.log(result)
   
    res.redirect('/MyProject')
}
async function renderMyProjectEdit(req,res){
    const {id} = req.params
    const query = `SELECT * FROM public."Blogs"
    WHERE id = ${id}
    `
    
    const dataToEdit = await sequelize.query(query,{type: QueryTypes.SELECT})
    const formattedData = {...dataToEdit[0], 
        start : new Date(dataToEdit[0].start).toISOString().split('T')[0],
        end : new Date(dataToEdit[0].end).toISOString().split('T')[0]
    }
    res.render("my-project-edit",{data:formattedData})
}

function isChecked(value,array){
    return array && array.includes(value) ? "checked" : ""
}


async function deleteProject(req,res){
    const {id} = req.params

    const query = `DELETE FROM public."Blogs"
                    WHERE id = ${id}
    `
    const result = await sequelize.query(query,{type: QueryTypes.DELETE})
   
    console.log(result)
    res.redirect('/MyProject')
}

module.exports={
renderHome,
renderContact,
renderProject,
addProject,
renderRating,
renderMyProjectAdd,
renderMyProjectEdit,
deleteProject,
updateProject,
renderProjectDetail,
isChecked,
}