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
  req.flash("success", "berhasil register");
  res.redirect("/login");
}

async function authLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    req.flash("error", "user tidak ditemukan");
    return res.redirect("/login");
  }

  const isValidated = await bcrypt.compare(password, user.password);

  if (!isValidated) {
    req.flash("error", "password salah");
    return res.redirect("/login");
  }

  let loggedInUser = user.toJSON();

  delete loggedInUser.password;
  console.log("setelah delete:", loggedInUser);

  req.session.user = loggedInUser;
  req.flash("success", "berhasil login");
  res.redirect("/index");
}

function authLogout(req, res) {
  req.session.user = null;

  res.redirect("/login");
}

async function renderProject(req, res) {
  const { user } = req.session;
  const project = await Blog.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });

  res.render("MyProject", { project: project, user, isMyProject: true });
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
  res.render("my-project-add", { user });
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

  res.redirect("/MyProject");
}
async function renderMyProjectEdit(req, res) {
  const { id } = req.params;
  const { user } = req.session;
  const dataToEdit = await Blog.findOne({ where: { id: id } });
  if (!dataToEdit) {
    return res.render("page-404");
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

  const result = await Blog.destroy({ where: { id } });

  console.log(result);
  res.redirect("/MyProject");
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
