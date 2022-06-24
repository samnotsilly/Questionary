const { pageTitle } = require("../utility");
const PAGE = "playQuiz";
const { con } = require("../mydb");

exports.get = (req, res) => {
  if (req.query.id) {
    con.query(
      `SELECT *, q.name as quizname, que.name as questionname, o.name as optionname FROM quizapp.quiz q, quizapp.subject s,quizapp.questions que, quizapp.optionkey o WHERE s.subjectid = q.subject_subjectid AND o.questions_quedstionsid = que.quedstionsid AND que.quiz_quizid = q.quizid AND q.quizid = ${req.query.id};`,
      (e, quiz) => {
        console.log(e);
        console.log(quiz);
        const question = [];
        for (let i = 0; i < quiz.length; i++) {
          if (
            question.findIndex((q) => q.questionid == quiz[i].quedstionsid) ==
            -1
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
          subjectname: quiz[0].sname,
          questions: question,
        };
        res.render("template", {
          page: PAGE,
          title: pageTitle[PAGE],
          sessiondata: req.session.user,
          isAdd: false,
          quiz: quizData,
        });
      }
    );
  }
};

exports.post = (req, res) => {
  console.log(req.body);

  con.query(
    `SELECT *, q.name as quizname, que.name as questionname, o.name as optionname FROM quizapp.quiz q, quizapp.subject s,quizapp.questions que, quizapp.optionkey o WHERE s.subjectid = q.subject_subjectid AND o.questions_quedstionsid = que.quedstionsid AND que.quiz_quizid = q.quizid AND q.quizid = ${req.body.quizid};`,
    (e, quiz) => {
      //   console.log(quiz);
      const question = [];
      for (let i = 0; i < quiz.length; i++) {
        if (
          question.findIndex((q) => q.questionid == quiz[i].quedstionsid) == -1
        ) {
          question.push({
            questionid: quiz[i].quedstionsid,
            questionName: quiz[i].questionname,
            correctOption: quiz[i].masterkey,
          });
        }
      }

      const questionPartId = [
        ...new Set(
          Object.keys(req.body)
            .filter((v) => v.indexOf("_") != -1)
            .map((v) => v.split("_")[1])
            .filter((v) => v)
        ),
      ];
      let currectAns = 0;
      for (let i = 0; i < questionPartId.length; i++) {
        const compareObj = question.find(
          (q) => q.questionid == questionPartId[i]
        );
        if (
          compareObj &&
          compareObj.correctOption == req.body[`question_${questionPartId[i]}`]
        ) {
          currectAns++;
        }
      }
      console.log();
      console.log(questionPartId);
      console.log(question);

      const data = {
        score: (currectAns * 100) / questionPartId.length,
        quiz_quizid: req.body.quizid,
        student_studentid: 7,
      };
      con.query("INSERT INTO quizapp.grades SET ?", data, (e, result) => {
        if (!e) {
          res.redirect("/listplayquiz");
        }
      });
    }
  );
  //   res.render("template", {
  //     page: PAGE,
  //     title: pageTitle[PAGE],
  //     sessiondata: req.session.user,
  //   });
};
