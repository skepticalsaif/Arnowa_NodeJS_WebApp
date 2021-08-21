const express = require("express");
const session = require("express-session");
const multer = require("multer"); // new - for file upload
const fs = require("fs").promises;

const port = process.env.PORT;

const { db, Users } = require("./db");

const app = express();
const upload = multer({ dest: "uploads/" }); // new - for file upload

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "24knb6k247b2k7b2k7bk247hb2kh7b2",
    // cookie: {
    //   expires: new Date('2021-08-31'),  // deprecated
    //   // or
    //   maxAge: 1000 * 60 * 60 * 24  // use this instead
    // }
  })
);

app.get("/", (req, res) => {
  res.render("login");
});

app.use("/images", express.static(__dirname + "/images")); // new

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", upload.single("avatar"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const oldPath = __dirname + "/uploads/" + req.file.filename;
  const newPath =
    __dirname +
    "/images/" +
    "avatar_" +
    req.body.username +
    "." +
    req.file.mimetype.split("/").pop();

  await fs.rename(oldPath, newPath);

  const user = await Users.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    avatar:
      "/images/" +
      "avatar_" +
      req.body.username +
      "." +
      req.file.mimetype.split("/").pop(),
  });

  res.render("login");
  // res.status(201).send(`User ${user.id} created`);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const user = await Users.findOne({ where: { username: req.body.username } });
  if (!user) {
    return res.status(404).render("login", { error: "No such username found" });
  }

  if (user.password !== req.body.password) {
    return res.status(401).render("login", { error: "Incorrect password" });
  }
  // store the user.id in cookie for later login
  req.session.userId = user.id;
  // if success then the below code works
  res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
  // if not logged in then redirect to /login
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  // .findByPk - find by primary key
  const user = await Users.findByPk(req.session.userId);
  res.render("dashboard", { user });
});

app.get("/logout", (req, res) => {
  req.session.userId = null;
  // req.session.destroy()
  // alternative to req.session.userId = null
  // this destroys the cookie itself and
  // a new cookie will be created, when a new session
  // gets created.
  res.redirect("/login");
});

db.sync() // '{ force: true }' for dropping the table
  .then(() => {
    app.listen(port, () =>
      console.log("started on http://localhost:2222/login")
    );
  })
  .catch(console.error);
