const { pageTitle } = require("../utility");
const PAGE = "listQuiz";
const fs = require("fs");
const path = require("path");

exports.get = (req, res) => {
  const { data } = JSON.parse(
    fs.readFileSync(path.resolve("data", "list.json"))
  );
  res.render("template", {
    page: PAGE,
    title: pageTitle[PAGE],
    sessiondata: req.session.user,
    msg: null,
    data,
  });
};
