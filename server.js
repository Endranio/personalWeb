const express = require("express");
var methodOverride = require("method-override");
var flash = require("express-flash")
var session = require("express-session");
const path = require("path");
const hbs = require("hbs");

const {
  renderLogin,
  renderRating,
  renderContact,
  renderHome,
  renderProject,
  addProject,
  renderMyProjectAdd,
  renderMyProjectEdit,
  updateProject,
  deleteProject,
  renderProjectDetail,
  renderRegister,
  authRegister,
  authLogin,
  authLogout,
  render404
} = require("./controllers/controllers-v2");
const { Time, getRelativeTime} = require("./utils/time");
const { truncateText } = require("./utils/text");
const {isChecked}= require("./utils/checkbox");
 const { sendAlert,sendAlertOption } = require("./assets/JS/sw2");
const {upload}= require("./middlewares/upload-files")


const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
// const environtment = process.env.NODE_ENV;
// const sequelize = new Sequelize(config[environtment]);

app.use(express.json());
app.use(flash())

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(methodOverride("_method"));


app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));


hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("Time", Time);
hbs.registerHelper("truncateText", truncateText);
hbs.registerHelper("getRelativeTime", getRelativeTime);
hbs.registerHelper("isChecked", isChecked);
hbs.registerHelper("equal", function (a, b) {
  return a === b;
});
hbs.registerHelper("sendAlert", (messages) => {
  return new hbs.SafeString(sendAlert(messages));
});



app.get("/", renderHome);
app.get("/register", renderRegister);
app.get("/login", renderLogin);
app.get("/logout", authLogout);
app.get("/rating", renderRating);
app.get("/page-404", render404);

app.get("/task-form", renderContact);

app.get("/my-project-add", renderMyProjectAdd);
app.get("/projectDetail/:id", renderProjectDetail);
app.get("/MyProject", renderProject);
app.post("/add-project",upload.single('image'), addProject);
app.post("/register", authRegister);
app.post("/login", authLogin);
app.get("/my-project-edit/:id", renderMyProjectEdit);
app.patch("/project-update/:id",upload.single('image'), updateProject);
app.delete("/blog-delete/:id", deleteProject);

app.listen(PORT, () => {
  console.log(`server berjalan di port${PORT}`);
  // console.log(`test dotenv ${process.env.URL_TEST}`);
}); 

