const { Sequelize, QueryTypes, where,Op } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("../config/config.js");
const { Blog, User } = require("../models");
require("dotenv").config();
const environtment = process.env.NODE_ENV
console.log("testtt :", environtment)
 
const sequelize = new Sequelize(config[environtment]);
const saltRounds = 10;

function renderHome(req, res) {
  const user = req.session.user;

  res.render("index", { user, isHome: true });
}

function renderContact(req, res) {
  const { user } = req.session;
  req.flash("message", {
    text: "All fields are required",
    icon: "error",
    title: "Failed",
  });
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
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });
  
  if (existingUser) {
    const isEmailTaken = existingUser.email === email;
   
  
    req.flash("message", {
      text: isEmailTaken
        ? "Email is already registered"
        : "Username is already registered",
      icon: "error",
      title: "Failed",
    });
    return res.redirect("/register");
  }
  
  if (!username || !email || !password) {
    req.flash("message", {
      text: "All fields are required",
      icon: "error",
      title: "Failed",
    });
    return res.redirect("/register");
  }

  if (password.length < 6) {
    req.flash("message", {
      text: "Password must be at least 6 characters",
      icon: "error",
      title: "Failed",
    });
    return res.redirect("/register");
  }


  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ username, email, password: hashedPassword });
  req.flash("message", {
    text: "registration successful",
    icon: "success",
    title: "success",
  });
  res.redirect("/login");
}

async function authLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });
if(!email || !password){
  req.flash("message", {
    text: "All fields are required",
    icon: "error",
    title: "Failed",
  });
  return res.redirect("/login");
}
  if (!user) {
    req.flash("message", {
      text: "user not found",
      icon: "error",
      title: "Oops",
    });

    return res.redirect("/login");
  }

  const isValidated = await bcrypt.compare(password, user.password);

  if (!isValidated) {
    req.flash("message", {
      text: "password wrong",
      icon: "error",
      title: "Oops",
    });
    return res.redirect("/login");
  }

  let loggedInUser = user.toJSON();

  delete loggedInUser.password;
  console.log("setelah delete:", loggedInUser);

  req.session.user = loggedInUser;
  req.flash("message", {
    text: "you are logged in",
    icon: "success",
    title: "success",
  });
  res.redirect("/");
}

function authLogout(req, res) {
  req.session.user = null;
  req.flash("message", {
    text: "now you are logged out",
    icon: "success",
    title: "success",
  });
  res.redirect("/login");
}

async function renderProject(req, res) {
  const { user } = req.session;
  const messages = {
    message: req.flash("message") || [], // Pesan notifikasi/error
    option: req.flash("option") || [], // Pesan konfirmasi
  };
  const project = await Blog.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });

  res.render("MyProject", {
    project: project,
    user,
    isMyProject: true,
    messages,
  });
}
async function renderProjectDetail(req, res) {
  const { user } = req.session;
  const { id } = req.params;

  const projectDetail = await Blog.findOne({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    where: { id: id },
  });
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

  let { user } = req.session;
  const { title, content, start, end, icon } = req.body;
  console.log("ini body:", req.body);
  const image = "http://localhost:3000/" + req.file.path;
 
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


  const result = await Blog.create({
    title: blind["title"],
    content: blind["content"],
    image,
    start,
    end,
    duration,
    icons: icons,
    user_id: user.id,
  });

  console.log("test result:", result);
  req.flash("message", {
    text: "project added",
    icon: "success",
    title: "success",
  });
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
  if (!user) {
    req.flash("message", {
      title: "Access Denied",
      text: "you have to logged in.",
      icon: "error",
    });
    return res.redirect("/login");
  }
  res.render("my-project-add", { user });
}

async function updateProject(req, res) {
  console.log("form submited");
  const { id } = req.params;
  const { user } = req.session;
  const { title, content, start, end, icon } = req.body;
  const icons = Array.isArray(icon) ? icon : [icon];
  const blind ={}
  blind["title"] = title;
  blind["content"] = content;
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
  const project = await Blog.findOne({ where: { id } });
  let image = project.image; 
  if (req.file) {
    image = "http://localhost:3000/" + req.file.path; 
  }
  await Blog.update(
    {
      title: blind["title"],
      content:blind["content"],
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
  req.flash("message", {
    text: "Project updated successfully",
    icon: "success",
    title: "Success",
  });
  res.redirect("/MyProject");
}
async function renderMyProjectEdit(req, res) {
  const { id } = req.params;
  const { user } = req.session;
  const dataToEdit = await Blog.findOne({ where: { id: id } });
  if (!user || dataToEdit.user_id !== user.id) {
    req.flash("message", {
      title: "Access Denied",
      text: "You are not the project owner.",
      icon: "error",
    });

    return res.redirect("/Myproject");
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
  const { user } = req.session;

  const result = await Blog.findOne({ where: { id } });

  if (!user || result.user_id !== user.id) {
    req.flash("message", {
      title: "Access Denied",
      text: "You are not the project owner.",
      icon: "error",
    });
    return res.redirect("/Myproject");
  }

  // if(result.user_id == user.id){

  //   req.flash("option",{
  //     text:"You won't be able to revert this!"
  //   })
  // }
  await Blog.destroy({ where: { id } });
  req.flash("message", {
    title: "Success",
    text: "project deleted",
    icon: "success",
  });
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
