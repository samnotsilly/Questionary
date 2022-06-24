const { pageTitle } = require("../utility");
const PAGE = "addStudent";
const { con } = require("../mydb");

exports.get = (req, res) => {
  con.query(
    `SELECT subjectid, sname FROM quizapp.subject s, quizapp.course c WHERE s.course_courseid = c.courseid AND admin_adminid = ${101};`,
    (e, subjects) => {
      if (req.query.id) {
        con.query(
          `SELECT s.studentid, s.firstname, s.lastname, s.address, s.email, ss.subject_subjectid FROM quizapp.student s, quizapp.student_has_subject ss WHERE s.studentid = ss.student_studentid AND s.studentid = ${req.query.id};`,
          function (e, result) {
            const student = {
              studentid: result[0].studentid,
              firstname: result[0].firstname,
              lastname: result[0].lastname,
              email: result[0].email,
              address: result[0].address,
              subjects: result.map((v) => v.subject_subjectid),
            };
            res.render("template", {
              page: PAGE,
              title: pageTitle[PAGE],
              sessiondata: req.session.user,
              isAdd: false,
              subjects: subjects,
              student: student,
            });
          }
        );
      } else {
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          isAdd: true,
          subjects: subjects,
          student: {},
        });
      }
    }
  );
};

exports.post = (req, res) => {
  console.log(req.body);
  if (req.body.studentid) {
    con.query(
      `UPDATE quizapp.student SET firstname = "${req.body.firstname}", lastname = "${req.body.lastname}", email = "${req.body.email}", address = "${req.body.address}" WHERE studentid = ${req.body.studentid}`,
      (e, result) => {
        res.redirect("/liststudent");
        // deleteStudentAndSubject(
        //   { student_studentid: req.body.studentid },
        //   function () {
        //     prepareEnrollStudents(
        //       Array.isArray(req.body.subjects)
        //         ? req.body.subjects
        //         : [req.body.subjects],
        //       req.body.studentid
        //     );
        //     console.log(e);
        //     if (!e) {
        //       res.redirect("/liststudent");
        //     }
        //   }
        // );
      }
    );
  } else {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      address: req.body.address,
      admin_adminid: 101, // TODO: add adminid dynamically
    };
    con.query("INSERT INTO quizapp.student SET ?", data, (e, result) => {
      console.log(e);
      if (!e) {
        prepareEnrollStudents(
          Array.isArray(req.body.subjects)
            ? req.body.subjects
            : [req.body.subjects],
          result.insertId
        );

        return res.redirect("/liststudent");
      }
    });
  }
};

const prepareEnrollStudents = async (subjects, studentid) => {
  const insertedData = await Promise.all(
    subjects.map((subject, i) => {
      return insertStudentAndSubject({
        student_studentid: studentid,
        subject_subjectid: subject,
      });
    })
  );
  return insertedData;
};

const deleteStudentAndSubject = (data, cb) => {
  con.query(
    `DELETE FROM quizapp.student_has_subject WHERE student_studentid=${data.student_studentid}`,
    data,
    (e, result) => {
      if (e) {
      }
      cb();
    }
  );
};

const insertStudentAndSubject = (data) => {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO quizapp.student_has_subject SET ?",
      data,
      (e, result) => {
        if (e) {
          return reject(e);
        }
        return resolve(result);
      }
    );
  });
};
