const { pageTitle } = require("../utility");
const PAGE = "createQuiz";
const { con } = require("../mydb");

exports.get = (req, res) => {
  con.query(
    `SELECT subjectid, sname FROM quizapp.subject s, quizapp.course c WHERE s.course_courseid = c.courseid AND admin_adminid = ${101};`,
    (e, subjects) => {
      console.log("3");
      if (req.query.id) {
        con.query(
          `SELECT *, q.name as quizname, que.name as questionname, o.name as optionname FROM quizapp.quiz q, quizapp.questions que, quizapp.optionkey o WHERE o.questions_quedstionsid = que.quedstionsid AND que.quiz_quizid = q.quizid AND q.quizid = ${req.query.id};`,
          (e, quiz) => {
            console.log(quiz);
            const question = [];
            for (let i = 0; i < quiz.length; i++) {
              if (
                question.findIndex(
                  (q) => q.questionid == quiz[i].quedstionsid
                ) == -1
              ) {
                question.push({
                  questionid: quiz[i].quedstionsid,
                  questionName: quiz[i].questionname,
                  correctOption: quiz[i].masterkey,
                });
              }
            }
            for (let i = 0; i < question.length; i++) {
              for (let j = 0; j < quiz.length; j++) {
                const questionIndex = question.findIndex(
                  (q) => q.questionid == quiz[j].questions_quedstionsid
                );
                if (questionIndex !== -1) {
                  question[questionIndex][`option${(j % 4) + 1}`] =
                    quiz[j].optionname;
                }
              }
            }

            console.log(question);
            const quizData = {
              quizid: quiz[0].quizid,
              name: quiz[0].quizname,
              subject: quiz[0].subject_subjectid,
              questions: question,
            };
            res.render("template", {
              page: PAGE,
              title: pageTitle[PAGE],
              sessiondata: req.session.user,
              isAdd: false,
              subjects: subjects,
              quiz: quizData,
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
          quiz: {},
        });
      }
    }
  );
};

exports.post = (req, res) => {
  console.log(req.body);
  if (req.body.quizid) {
    con.query(
      `UPDATE quizapp.quiz SET name = "${req.body.quizname}", subject_subjectid = "${req.body.subject}" WHERE quizid = ${req.body.quizid}`,
      (e, result) => {
        console.log(e);
        if (!e) {
          prepareQuestionAndOptions(req.body, result.insertId);
          return res.redirect("/listquiz");
        }
      }
    );
  } else {
    const data = {
      name: req.body.quizname,
      subject_subjectid: req.body.subject,
    };

    con.query("INSERT INTO quizapp.quiz SET ?", data, (e, result) => {
      console.log(e);
      if (!e) {
        prepareQuestionAndOptions(req.body, result.insertId);
        return res.redirect("/listquiz");
      }
    });
  }
};

const prepareQuestionAndOptions = async (data, quizid) => {
  const questionPartId = [
    ...new Set(
      Object.keys(data)
        .filter((v) => v.indexOf("_") != -1)
        .map((v) => v.split("_")[1])
        .filter((v) => v)
    ),
  ];

  const optionsPartId = [
    ...new Set(
      Object.keys(data)
        .filter((v) => v.indexOf("_") != -1)
        .map((v) => v.split("_")[2])
        .filter((v) => v)
    ),
  ];

  const insertedData = await Promise.all(
    questionPartId.map((question, i) => {
      return insertQuestionsAndOptions({
        questiondata: {
          name: data[`question_${question}`],
          masterkey: data[`inputCorrectOption_${question}`],
          quiz_quizid: quizid,
        },
        optiondata: optionsPartId.map((option) => ({
          name: data[`option_${question}_${option}`],
          questions_quedstionsid: "",
        })),
      });
    })
  );
  return insertedData;
};

const insertQuestionsAndOptions = async (data) => {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO quizapp.questions SET ?`,
      data.questiondata,
      async (e, question) => {
        if (e) {
          return reject(e);
        }

        await Promise.all(
          data.optiondata.map((option) => {
            option.questions_quedstionsid = question.insertId;
            return insertOptions(option);
          })
        );
        return resolve(question);
      }
    );
  });
};

const insertOptions = (data) => {
  new Promise((resolve, reject) => {
    con.query(`INSERT INTO quizapp.optionkey SET ?`, data, (e, options) => {
      if (e) {
        return reject(e);
      }
      return resolve(options);
    });
  });
};
