const { Sequelize, QueryTypes, where } = require("sequelize");
const config = require("../config/config.json");
const { Blog } = require("../models");
const sequelize = new Sequelize(config.development);

function renderHome(req, res) {
  res.render("index", { isHome: true });
}
function renderContact(req, res) {
  res.render("task-form");
}
function renderRegister(req, res) {
  res.render("auth-register");
}

function authRegister(req,res) {
  const {username,email,password} = req.body
  console.log('authRegister const:',req.body)

  res.redirect("/register")
}

async function renderProject(req, res) {
  const project = await Blog.findAll({
    order: [["createdAt", "DESC"]],
  });
  console.log(project);

  res.render("MyProject", { project: project, isMyProject: true });
}
async function renderProjectDetail(req, res) {
  const { id } = req.params;

  const projectDetail = await Blog.findOne({ where: { id: id } });

  if (projectDetail === null) {
    res.send("page-404");
  } else {
    console.log("projectDetailnya:", projectDetail);
    res.render("projectDetail", { data: projectDetail });
  }
}

async function addProject(req, res) {
  console.log("form submited");

  const { title, content, start, end, icon } = req.body;
  const blind = {};
  blind["title"] = title;
  blind["content"] = content;
  const icons = Array.isArray(icon) ? icon : [icon];
  const formattedIcons = `{${icons.join(",")}}`;
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
    icon: formattedIcons,
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
  const formattedIcons = `{${icons.join(",")}}`;
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
      icons: formattedIcons, 
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
  // const formattedData = {
  //   ...dataToEdit,
  //   title: dataToEdit.title,
  //   content: dataToEdit.content,
  //   start: new Date(dataToEdit.start).toISOString().split("T")[0],
  //   end: new Date(dataToEdit.end).toISOString().split("T")[0],
  // };
  console.log("ini data edittt:", dataToEdit);
  res.render("my-project-edit", { data: dataToEdit });
}

function isChecked(value, array) {
  return array && array.includes(value) ? "checked" : "";
}

async function deleteProject(req, res) {
  const { id } = req.params;

  const result = await Blog.destroy({ where: { id } });

  console.log(result);
  res.redirect("/MyProject");
}

module.exports = {
  renderRegister,
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
