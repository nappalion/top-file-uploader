require("dotenv").config();
const path = require("node:path");
const express = require("express");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./db/prismadb");
const passport = require("passport");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

require("./db/passport");

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./routes/user-routes");
const fileRoutes = require("./routes/file-routes");
const folderRoutes = require("./routes/folder-routes");

app.use("/", userRoutes);
app.use("/files", fileRoutes);
app.use("/folders", folderRoutes);

app.listen(3000, () => console.log("app listening on port 3000!"));
