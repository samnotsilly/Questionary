const path = require("path");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const { pageTitle } = require("../utility");
const PAGE = "listPage";
const { con } = require("../mydb");

const html = fs.readFileSync(
  path.join(__dirname, "..", "public", "template.html"),
  "utf8"
);

exports.get = async (req, res) => {
  con.query(
    `SELECT q.quizid, q.name, s.sname FROM quizapp.quiz q, quizapp.subject s, quizapp.course c WHERE q.subject_subjectid = s.subjectid AND s.course_courseid = c.courseid AND c.admin_adminid = ${101};`,
    (err, result, fields) => {
      con.query(
        `SELECT q.quizid from quizapp.quiz q, quizapp.grades g, quizapp.student s WHERE q.quizid = g.quiz_quizid AND g.student_studentid = s.studentid AND s.studentid = ${7}`,
        (err, quizid, fields) => {
          con.query(
            `
          SELECT g.score, s.studentid, s.firstname, s.lastname, q.name as quizname, sub.sname as subjectname FROM quizapp.grades g, quizapp.student s, quizapp.quiz q, quizapp.subject sub WHERE 
g.student_studentid = s.studentid AND
g.quiz_quizid = q.quizid AND 
q.subject_subjectid = sub.subjectid AND s.studentid = ${7};`,
            (e, data) => {
              console.log(data);
              let fileSrc = null;
              if (data.length > 0) {
                const options = {
                  format: "A4",
                  orientation: "portrait",
                  border: "10mm",
                };
                const student = {
                  studentName: `${data[0].firstname} ${data[0].lastname}`,
                  studentNumber: `${data[0].studentid}`,
                  date: new Date().toISOString().split("T")[0],
                };
                const grades = data.map((grade) => ({
                  quizname: grade.quizname,
                  subject: grade.subjectname,
                  score: grade.score,
                }));

                const fileName = `${data[0].firstname}_${data[0].lastname}.pdf`;
                var document = {
                  html: html,
                  data: { student: [student], grades: grades },
                  path: path.join(__dirname, "..", "public", "docs", fileName),
                  type: "", // "stream" || "buffer" || "" ("" defaults to pdf)
                };

                //console.log(document);
                pdf
                  .create(document, options)
                  .then((fileData) => {
                    fileSrc = "http://localhost:3000/docs/" + fileName;
                    console.log(fileData);
                    console.log(quizid);
                    console.log(err);
                    console.log(result);
                    res.render("template", {
                      page: PAGE,
                      title: pageTitle[PAGE],
                      sessiondata: req.session.user,
                      subpage: "playquiz",
                      msg: "",
                      fileLink: { path: fileSrc, name: fileName },
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
                                quizid.findIndex(
                                  (q) => q.quizid == v.quizid
                                ) !== -1
                                  ? "fas fa-check-circle text-success"
                                  : "",
                              actionText:
                                quizid.findIndex(
                                  (q) => q.quizid == v.quizid
                                ) !== -1
                                  ? "Given"
                                  : "Play",
                              redirectUrl:
                                quizid.findIndex(
                                  (q) => q.quizid == v.quizid
                                ) !== -1
                                  ? ""
                                  : `/playquiz?id=${v.quizid}`,
                            },
                          ],
                        })),
                      },
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                console.log(quizid);
                console.log(err);
                console.log(result);
                res.render("template", {
                  page: PAGE,
                  title: pageTitle[PAGE],
                  sessiondata: req.session.user,
                  subpage: "playquiz",
                  msg: "Please play at least one quiz in order to generate report",
                  fileLink: fileSrc,
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
            }
          );
        }
      );
    }
  );

  // res.render("template", {
  //   path: filepath,
  //   page: PAGE,
  //   title: pageTitle[PAGE],
  //   sessiondata: req.session.user,
  //   msg: "Please complete any quiz to generate report",
  //   filelink: "http://localhost:3000/reports/output.pdf",
  // });
};
