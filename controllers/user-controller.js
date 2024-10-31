const prisma = require("../db/prismadb");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isAuth } = require("../routes/auth-middleware");

const signupGet = [
  (req, res) => {
    res.render("index", { title: "Sign up" });
  },
];

const signupPost = [
  async (req, res, next) => {
    try {
      const { first_name, last_name, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email: username,
          firstName: first_name,
          lastName: last_name,
          password: hashedPassword,
        },
      });

      next();
    } catch (err) {
      return next(err);
    }
  },
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  }),
];

const loginGet = [
  (req, res) => {
    res.render("login", { title: "Log in" });
  },
];

const loginPost = [
  async (req, res, next) => {
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login-failed",
  }),
];

function loginFailedGet(req, res) {
  res.render("login", {
    title: "Log in",
    login_failed: true,
  });
}

function logoutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/login");
}

const homeGet = [
  isAuth,
  (req, res) => {
    res.render("home", {
      title: "Home",
      filePath: "",
    });
  },
];

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  loginFailedGet,
  logoutPost,
  homeGet,
};
