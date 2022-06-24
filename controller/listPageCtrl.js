const { pageTitle } = require("../utility");
const { con } = require("../mydb");
const PAGE = "listPage";

exports.get = (req, res) => {
  console.log(req.path);

  if (req.path == "/listprofessor") {
    con.query(
      "SELECT * FROM quizapp.professor WHERE admin_adminid = 101;",
      (err, result, fields) => {
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          subpage: "professor",
          msg: null,
          fileLink: null,
          data: {
            headers: {
              firstname: "First Name",
              lastname: "Last Name",
              email: "Email",

              action: "Action",
            },
            rows: result.map((v) => ({
              firstname: v.firstname || "-",
              lastname: v.lastname || "-",
              email: v.email || "-",

              action: [
                {
                  actionIcon: "",
                  actionText: "Edit",
                  redirectUrl: `/addprofessor?id=${v.professorid}`,
                },
              ],
            })),
          },
        });
      }
    );
  } else if (req.path == "/listcourse") {
    con.query(
      "SELECT c.courseid, c.coursename, count(*) as noofsubjects FROM quizapp.course c, quizapp.subject s WHERE s.course_courseid = c.courseid GROUP BY c.courseid;",
      (err, result, fields) => {
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          subpage: "course",
          msg: null,
          fileLink: null,
          data: {
            headers: {
              coursename: "Course Name",
              noofsubjects: "No of subjects",
              action: "Action",
            },
            rows: result.map((v) => ({
              coursename: v.coursename || "-",
              noofsubjects: v.noofsubjects || "0",
              action: [
                {
                  actionIcon: "",
                  actionText: "Edit",
                  redirectUrl: `/addcourse?id=${v.courseid}`,
                },
              ],
            })),
          },
        });
      }
    );
  } else if (req.path == "/liststudent") {
    con.query(
      "SELECT * FROM quizapp.student WHERE admin_adminid = 101;",
      (err, result, fields) => {
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          subpage: "student",
          msg: null,
          fileLink: null,
          data: {
            headers: {
              firstname: "First Name",
              lastname: "Last Name",
              email: "Email",
              address: "Address",
              action: "Action",
            },
            rows: result.map((v) => ({
              firstname: v.firstname || "-",
              lastname: v.lastname || "-",
              email: v.email || "-",
              address: v.address || "-",
              action: [
                {
                  actionIcon: "",
                  actionText: "Edit",
                  redirectUrl: `/addstudent?id=${v.studentid}`,
                },
              ],
            })),
          },
        });
      }
    );
  } else if (req.path == "/listquiz") {
    con.query(
      `SELECT q.quizid, q.name, s.sname FROM quizapp.quiz q, quizapp.subject s, quizapp.course c WHERE q.subject_subjectid = s.subjectid AND s.course_courseid = c.courseid AND c.admin_adminid = ${101};`,
      (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          subpage: "quiz",
          msg: null,
          fileLink: null,
          data: {
            headers: {
              quizname: "Quiz Name",
              subject: "Subject",
              action: "Action",
            },
            rows: (result || []).map((v) => ({
              quizname: v.name || "-",
              subject: v.sname || "-",
              action: [
                {
                  actionIcon: "",
                  actionText: "Edit",
                  redirectUrl: `/createQuiz?id=${v.quizid}`,
                },
              ],
            })),
          },
        });
      }
    );
  } else if (req.path == "/listplayquiz") {
    con.query(
      `SELECT q.quizid, q.name, s.sname FROM quizapp.quiz q, quizapp.subject s, quizapp.course c WHERE q.subject_subjectid = s.subjectid AND s.course_courseid = c.courseid AND c.admin_adminid = ${101};`,
      (err, result, fields) => {
        con.query(
          `SELECT q.quizid from quizapp.quiz q, quizapp.grades g, quizapp.student s WHERE q.quizid = g.quiz_quizid AND g.student_studentid = s.studentid AND s.studentid = ${7}`,
          (err, quizid, fields) => {
            console.log(quizid);
            console.log(err);
            console.log(result);
            res.render("template", {
              page: PAGE,
              title: pageTitle[PAGE],
              sessiondata: req.session.user,
              subpage: "playquiz",
              msg: null,
              fileLink: null,
              data: {
                headers: {
                  quizname: "Quiz Name",
                  subject: "Subject",
                  action: "Action",
                },
                rows: (result || []).map((v) => ({
                  quizname: v.name || "-",
                  subject: v.sname || "-",
                  action: [
                    {
                      actionIcon:
                        quizid.findIndex((q) => q.quizid == v.quizid) !== -1
                          ? "fas fa-check-circle text-success"
                          : "",
                      actionText:
                        quizid.findIndex((q) => q.quizid == v.quizid) !== -1
                          ? "Given"
                          : "Play",
                      redirectUrl:
                        quizid.findIndex((q) => q.quizid == v.quizid) !== -1
                          ? ""
                          : `/playquiz?id=${v.quizid}`,
                    },
                  ],
                })),
              },
            });
          }
        );
      }
    );
  } else {
    res.redirect("/404");
  }
};
