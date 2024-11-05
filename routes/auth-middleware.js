function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
}

function isAuthRedirectToHome(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/folders");
  } else {
    next();
  }
}

module.exports = { isAuth, isAuthRedirectToHome };
