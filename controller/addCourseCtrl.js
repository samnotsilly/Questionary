const { pageTitle } = require("../utility");
const PAGE = "addCourse";
const { con } = require("../mydb");

exports.get = (req, res) => {
  console.log(req.query);
  con.query(
    `SELECT * FROM quizapp.professor WHERE admin_adminid = ${101};`,
    (e, result) => {
      const professors = result.map((v) => ({
        id: v.professorid,
        name: `${v.firstname} ${v.lastname}`,
      }));
      if (req.query.id) {
        con.query(
          `SELECT c.courseid, c.coursename, s.subjectid, s.sname, s.professor_professorid FROM quizapp.course c, quizapp.subject s WHERE s.course_courseid = c.courseid AND courseid = ${req.query.id};`,
          (e, result) => {
            const course = {
              courseid: result[0].courseid,
              coursename: result[0].coursename,
              subjects: result.map((v) => ({
                subjectId: v.subjectid,
                subjectName: v.sname,
                assignedProfessor: v.professor_professorid,
              })),
            };

            console.log(course);
            res.render("template", {
              page: PAGE,
              title: pageTitle[PAGE],
              sessiondata: req.session.user,
              professors,
              course: course,
              isAdd: false,
            });
          }
        );
      } else {
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          professors,
          course: {},
          isAdd: true,
        });
      }
    }
  );
};

exports.post = async (req, res) => {
  console.log(req.body);
  if (req.body.courseid) {
    console.log(req.body);
    con.query(
      `UPDATE quizapp.course SET coursename = "${req.body.coursename}" WHERE courseid = ${req.body.courseid}`,
      (e, result) => {
        res.redirect("/listcourse");
        // con.query(
        //   `DELETE FROM quizapp.subject WHERE course_courseid = ${req.body.courseid}`,
        //   (e, result) => {
        //     console.log(e);
        //     console.log(result);
        //     const insertedData = prepareSubject(req.body, req.body.courseid);
        //     console.log(insertedData);
        //     res.redirect("/listcourse");
        //   }
        // );
      }
    );
  } else {
    con.query(
      "INSERT INTO quizapp.course SET ?",
      {
        coursename: req.body.coursename,
        admin_adminid: 101,
      },
      async (e, result) => {
        console.log(e);
        console.log(result);
        const insertedData = prepareSubject(req.body, result.insertId);
        console.log(insertedData);
        res.redirect("/listcourse");
      }
    );
  }
};

const prepareSubject = async (data, courseid) => {
  const subjectPartId = [
    ...new Set(
      Object.keys(data)
        .filter((v) => v.indexOf("_") != -1)
        .map((v) => v.split("_")[1])
        .filter((v) => v)
    ),
  ];
  const insertedData = await Promise.all(
    subjectPartId.map(async (v, i) => {
      return insetSubject({
        sname: data[`subjectname_${v}`],
        professor_professorid: data[`professor_${v}`],
        course_courseid: courseid,
      });
    })
  );
  return insertedData;
};

const insetSubject = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    con.query("INSERT INTO quizapp.subject SET ?", data, (e, result) => {
      console.log(e);
      if (e) {
        return reject(e);
      }
      return resolve(result);
    });
  });
};
