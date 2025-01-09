const { Sequelize, QueryTypes, where } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Blog, User } = require("../models");
const sequelize = new Sequelize(config.development);
const saltRounds = 10;

function renderHome(req, res) {
  const user = req.session.user;

  res.render("index", { user, isHome: true });
}

function renderContact(req, res) {
  const { user } = req.session;
  res.render("task-form", { user });
}
function renderLogin(req, res) {
  res.render("auth-login");
}
function renderRegister(req, res) {
  res.render("auth-register");
}

async function authRegister(req, res) {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ username, email, password: hashedPassword });
  req.flash("message", {
    text:"registration successful",
    icon:"success",
    title:"success"}
  );
  res.redirect("/login");
}

async function authLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    req.flash("message", {
      text:"user tidak ditemukan",
      icon:"error",
      title:"Oops"}
    );

    return res.redirect("/login",);
  }

  const isValidated = await bcrypt.compare(password, user.password);

  if (!isValidated) {
    req.flash("message", {
      text:"password salah",
      icon:"error",
      title:"Oops"})
    return res.redirect("/login");
  }

  let loggedInUser = user.toJSON();

  delete loggedInUser.password;
  console.log("setelah delete:", loggedInUser);

  req.session.user = loggedInUser;
  req.flash("message", {
    text:"you are logged in",
    icon:"success",
    title:"success"}
  );
  res.redirect("/index");
}

function authLogout(req, res) {
  req.session.user = null;
  req.flash("message", {
    text:"now you are logged out",
    icon:"success",
    title:"success"}
  );
  res.redirect("/login");
}

async function renderProject(req, res) {
  const { user } = req.session;
  const messages = {
    message: req.flash("message") || [], // Pesan notifikasi/error
    option: req.flash("option") || [],  // Pesan konfirmasi
  };
  const project = await Blog.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });

  res.render("MyProject", { project: project, user, isMyProject: true,messages });
}
async function renderProjectDetail(req, res) {
  const { user } = req.session;
  const { id } = req.params;

  const projectDetail = await Blog.findOne({ where: { id: id } });
  if (!projectDetail) {
    return res.render("page-404");
  }

  const formattedData = {
    ...projectDetail.dataValues,
    start: new Date(projectDetail.start).toISOString().split("T")[0],
    end: new Date(projectDetail.end).toISOString().split("T")[0],
  };

  res.render("projectDetail", { data: formattedData, user });
}

async function addProject(req, res) {
  console.log("form submited");

  let {user} =req.session
  const { title, content, start, end, icon } = req.body;
  console.log("ini body:", req.body);
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
    icons: icons,
    user_id:user.id 
  });
  
  console.log("test result:" ,result)
  req.flash("message", {
    text:"project added",
    icon:"success",
    title:"success"}
  );
  res.redirect("/MyProject");
}

// RATING
function renderRating(req, res) {
  const { user } = req.session;
  res.render("rating", { isRating: true, user });
}
function render404(req, res) {
  const { user } = req.session;
  res.render("/page-404", { user });
}

function renderMyProjectAdd(req, res) {
  const { user } = req.session;
  res.render("my-project-add", { user });
}

async function updateProject(req, res) {
  console.log("form submited");
  const { id } = req.params;
  const{user} = req.session
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
  

   await Blog.update(
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

  res.redirect("/MyProject");
}
async function renderMyProjectEdit(req, res) {
  const { id } = req.params;
  const { user } = req.session;
  const dataToEdit = await Blog.findOne({ where: { id: id } });
  if ( !user||dataToEdit.user_id !== user.id){
    req.flash("message", {
      title: "Access Denied",
      text: "You are not the project owner.",
      icon: "error",
  });
  
  return res.redirect("/Myproject")
  }

  const formattedData = {
    ...dataToEdit.dataValues,
    start: new Date(dataToEdit.start).toISOString().split("T")[0],
    end: new Date(dataToEdit.end).toISOString().split("T")[0],
  };

  res.render("my-project-edit", { data: formattedData, user });
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const {user} = req.session

  const result = await Blog.findOne({ where: { id } });
  
  if ( !user||result.user_id !== user.id){
    req.flash("message", {
      title: "Access Denied",
      text: "You are not the project owner.",
      icon: "error",
  });
  return res.redirect("/Myproject")
  }

  // if(result.user_id == user.id){

  //   req.flash("option",{
  //     text:"You won't be able to revert this!"
  //   })
  // }
  await Blog.destroy({ where: { id } })
  req.flash("message", {
    title: "Success",
    text: "project deleted",
    icon: "success",})
  return res.redirect("/MyProject");
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
  render404,
};
