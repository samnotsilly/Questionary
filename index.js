const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

const appRouter = require("./router.js");

app.use(
  session({
    secret: "taptrolldb",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("trust", 1);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use("/", appRouter);

app.listen(3000, () => {
  console.log("Quiz Application running at port 3000");
});
