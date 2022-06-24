const express = require("express");

const router = express.Router();

const homeCtrl = require("./controller/homeCtrl");
const addStudentCtrl = require("./controller/addStudentCtrl");
const addProfessorCtrl = require("./controller/addProfessorCtrl");
const addCourseCtrl = require("./controller/addCourseCtrl");
const createQuizCtrl = require("./controller/createQuizCtrl");
const listQuizCtrl = require("./controller/listQuizCtrl");
const playQuizCtrl = require("./controller/playQuizCtrl");
const listPageCtrl = require("./controller/listPageCtrl");
const showReportCtrl = require("./controller/showReportCtrl");
const loginCtrl = require("./controller/loginCtrl");
const logoutCtrl = require("./controller/logoutCtrl");

router.get("", homeCtrl.get);

router.get("/addstudent", addStudentCtrl.get);
router.post("/addstudent", addStudentCtrl.post);

router.get("/listprofessor", listPageCtrl.get);
router.get("/listcourse", listPageCtrl.get);
router.get("/liststudent", listPageCtrl.get);
router.get("/listquiz", listPageCtrl.get);
router.get("/listplayquiz", listPageCtrl.get);

router.get("/addprofessor", addProfessorCtrl.get);
router.post("/addprofessor", addProfessorCtrl.post);

router.get("/addcourse", addCourseCtrl.get);
router.post("/addcourse", addCourseCtrl.post);

router.get("/createquiz", createQuizCtrl.get);
router.post("/createquiz", createQuizCtrl.post);

router.get("/playquiz", playQuizCtrl.get);
router.post("/playquiz", playQuizCtrl.post);

router.get("/showreport", showReportCtrl.get);

router.get("/login", loginCtrl.get);
router.post("/login", loginCtrl.post);

router.get("/logout", logoutCtrl.get);

router.get("*", (req, res) => {
  res.render("template", { page: "404", title: "404" });
});

module.exports = router;
