const { pageTitle } = require("../utility");
const PAGE = "addProfessor";
const { con } = require("../mydb");

exports.get = (req, res) => {
  if (req.query.id) {
    con.query(
      `SELECT * FROM quizapp.professor WHERE professorid = ${req.query.id}`,
      (e, result) => {
        console.log(result);
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          user: result[0],
          isAdd: false,
        });
      }
    );
  } else {
    res.render("template", {
      page: PAGE,
      title: pageTitle[PAGE],
      sessiondata: req.session.user,
      isAdd: true,
      user: {},
    });
  }
};

exports.post = (req, res) => {
  console.log(req.body);
  if (req.body.professorid) {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    };
    con.query(
      `UPDATE quizapp.professor SET firstname = "${req.body.firstname}", lastname = "${req.body.lastname}", email = "${req.body.email}" WHERE professorid = ${req.body.professorid}`,
      data,
      (e, result) => {
        console.log(e);
        if (!e) {
          res.redirect("/listprofessor");
        }
      }
    );
  } else {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      admin_adminid: 101, // TODO: add adminid dynamically
    };
    con.query("INSERT INTO quizapp.professor SET ?", data, (e, result) => {
      if (!e) {
        res.redirect("/listprofessor");
      }
    });
  }
};
