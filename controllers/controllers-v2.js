const { Sequelize, QueryTypes, where } = require("sequelize");
const bcrypt = require('bcrypt')
const config = require("../config/config.json");
const { Blog,User } = require("../models");
const sequelize = new Sequelize(config.development);
const saltRounds = 10



function renderHome(req, res) {

  const user = req.session.user
  
  res.render("index", {user, isHome: true }); 
}

function renderContact(req, res) {
  res.render("task-form");
}
function renderLogin(req, res) {
  res.render("auth-login");
}
function renderRegister(req, res) {
  res.render("auth-register");
}

async function authRegister(req,res) {
  const {username,email,password} = req.body
  
  const hashedPassword = await bcrypt.hash(password,saltRounds)

  const user = await User.create({username,email,password:hashedPassword})
  
  res.redirect("/login")
}

async function authLogin(req,res){
  const{email,password}=req.body
  
  const user = await User.findOne({where:{email:email}})
  
  
  if(!user){
    return res.render("page-404")
  }
  
  const isValidated = await bcrypt.compare(password,user.password)
  
  if(!isValidated){
    return res.render("page-404")
  }
  
  let loggedInUser = user.toJSON();

  delete loggedInUser.password;
console.log('setelah delete:',loggedInUser)

  req.session.user = loggedInUser;
  
  res.redirect("/index")
}

function authLogout(req,res){

  req.session.user=null

  res.redirect("/login")
}


async function renderProject(req, res) {

  const {user} = req.session
  const project = await Blog.findAll({
    order: [["createdAt", "DESC"]],
  });
  console.log(project);

  res.render("MyProject", { project: project,user, isMyProject: true });
}
async function renderProjectDetail(req, res) {
  const { id } = req.params;

  const projectDetail = await Blog.findOne({ where: { id: id } });
  const formattedData = {
    ...projectDetail.dataValues,
    start: new Date(projectDetail.start).toISOString().split("T")[0],
    end: new Date(projectDetail.end).toISOString().split("T")[0],
  };
  if (formattedData === null) {
    res.send("page-404");
  } else {
  
    res.render("projectDetail", { data: formattedData });
  }
}

async function addProject(req, res) {
  console.log("form submited");

  const { title, content, start, end, icon } = req.body;
  console.log("ini body:",req.body)
  const blind = {};
  blind["title"] = title;
  blind["content"] = content;
  const icons = Array.isArray(icon) ? icon : [icon];
  let durationInMonth = Math.floor(
    (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24 * 30)
  );
  let durationInDay = Math.floor(
    (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
  );
  let duration;
  if (durationInMonth > 0) {
    duration = `${durationInMonth} Month${durationInMonth > 1 ? "s" : ""} `;
  } else {
    duration = `${durationInDay} Day${durationInDay > 1 ? "s" : ""}`;
  } 

  const image = "https://picsum.photos/200/300";

  const result = await Blog.create({
    title: blind["title"],
    content: blind["content"],
    image,
    start,
    end,
    duration,
    icons: icons
  });

  console.log("user createddddddddddd:", result);

  res.redirect("/MyProject");
}

// RATING
function renderRating(req, res) { 
  res.render("rating", { isRating: true });
}

function renderMyProjectAdd(req, res) {
  res.render("my-project-add");
}

async function updateProject(req, res) {
  console.log("form submited");
  const { id } = req.params;
  const { title, content, start, end, icon } = req.body;
  const icons = Array.isArray(icon) ? icon : [icon];
  let durationInMonth = Math.floor(
    (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24 * 30)
  );
  let durationInDay = Math.floor(
    (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
  );
  let duration;
  if (durationInMonth > 0) {
    duration = `${durationInMonth} Month${durationInMonth > 1 ? "s" : ""} `;
  } else {
    duration = `${durationInDay} Day${durationInDay > 1 ? "s" : ""}`;
  }

  const image = "https://picsum.photos/200/300";

  const result = await Blog.update(
    {
      title: title,
      content: content,
      image: image,
      start: start,
      end: end,
      duration: duration,
      icons: icons, 
      updatedAt: sequelize.fn("NOW "),
    },
    {
      where: { id: id },
    }
  );

  console.log('hasil darisequelize update:',result);

  res.redirect("/MyProject");
} 
async function renderMyProjectEdit(req, res) {  
  const { id } = req.params;

  const dataToEdit = await Blog.findOne({ where: { id:id } });
  const formattedData = {
    ...dataToEdit.dataValues,
    start: new Date(dataToEdit.start).toISOString().split("T")[0],
    end: new Date(dataToEdit.end).toISOString().split("T")[0],
  };
  
  res.render("my-project-edit", { data: formattedData });
}


async function deleteProject(req, res) {
  const { id } = req.params;

  const result = await Blog.destroy({ where: { id } });
  
  console.log(result);
  res.redirect("/MyProject");
  
}

function isChecked(value, array) {
  return array && array.includes(value) ? "checked" : "";
}
module.exports = {

  renderRegister,
  renderLogin,
  authLogin,
  authLogout,
  authRegister,
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
};
