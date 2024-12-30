const express = require("express");
var methodOverride = require("method-override")
const path = require("path");
const hbs = require("hbs");
require("dotenv").config();
const {
  renderHome,
  renderProject,
  addProject,
  renderMyProjectAdd,
  renderMyProjectEdit,
  updateProject,
  deleteProject,
  renderContact,
  renderRating,
  renderProjectDetail,
  isChecked,
} = require("./controllers/controllers");
const { Time, getRelativeTime } = require("./utils/time");
const { truncateText } = require("./utils/text");
// const {successalert,erroralert} = requare("./utils/sweetalert2")

const app = express();
const port = process.env.SERVER_PORT ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(methodOverride("_method"))

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("Time", Time);
hbs.registerHelper("truncateText", truncateText)
hbs.registerHelper("getRelativeTime", getRelativeTime);
hbs.registerHelper("isChecked",isChecked)

app.get("/index", renderHome);

app.get("/rating", renderRating);

app.get("/task-form", renderContact);

app.get("/my-project-add", renderMyProjectAdd);
app.get("/projectDetail/:id", renderProjectDetail);
app.get("/MyProject", renderProject);
app.post("/add-project", addProject);
app.get("/my-project-edit/:id", renderMyProjectEdit);
app.patch("/project-update/:id", updateProject);
app.delete("/blog-delete/:id", deleteProject);

app.listen(port, () => {
  console.log(`server berjalan di port${port}`);
  console.log(`test dotenv ${process.env.URL_TEST}`)
});
