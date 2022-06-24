window.addEventListener("DOMContentLoaded", (event) => {
  if (question.length > 0) {
    const questionEl = document.getElementById("question");
    questionEl.innerHTML = updateQuestion();
  } else {
    addQuestion();
  }
});

const addQuestion = () => {
  const questionEl = document.getElementById("question");
  copyPreviousQuestion(questionEl, true);
  questionEl.innerHTML = updateQuestion();
};
const removeQuestion = (i) => {
  const questionEl = document.getElementById("question");
  copyPreviousQuestion(questionEl, false);
  question.splice(i, 1);
  questionEl.innerHTML = updateQuestion();
};
const updateQuestion = () => {
  let htmlString = "";

  const addButton = `<div class="col-md-2">
                        <div class="mb-3 mb-md-0">
                            <button type="button" class="btn btn-success btn-block w-100 h-100" onclick="addQuestion()">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>`;

  question.forEach((val, i) => {
    const deleteButton = `<div class="col-md-2">
                                <div class="mb-3 mb-md-0">
                                    <button type="button" class="btn btn-danger btn-block w-100 h-100" onclick="removeQuestion(${i})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>`;
    htmlString += `<div class="row mb-3">
                            <div class="col-md-${isAdd ? "8" : "12"}">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="question_${i}" type="text" name="question_${i}" placeholder="Enter question" value="${
      val.questionName
    }" ${isAdd ? "" : "disabled"} />
                                    <label for="question_${i}">Question</label>
                                </div>
                            </div>
                            ${
                              isAdd && i == question.length - 1 ? addButton : ""
                            }
                            ${
                              isAdd &&
                              question.length !== 1 &&
                              i < question.length
                                ? deleteButton
                                : ""
                            }
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="inputOption_${i}_1" type="text" name="option_${i}_1" placeholder="Enter Option 1" value="${
      val.option1
    }" ${isAdd ? "" : "disabled"} />
                                    <label for="inputOption_${i}_1">Option 1</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="inputOption_${i}_2" type="text" name="option_${i}_2" placeholder="Enter Option 2" value="${
      val.option2
    }" ${isAdd ? "" : "disabled"} />
                                    <label for="inputOption_${i}_2">Option 2</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="inputOption_${i}_3" type="text" name="option_${i}_3" placeholder="Enter Option 3" value="${
      val.option3
    }" ${isAdd ? "" : "disabled"} />
                                    <label for="inputOption_${i}_3">Option 3</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="inputOption_${i}_4" type="text" name="option_${i}_4" placeholder="Enter Option 4" value="${
      val.option4
    }" ${isAdd ? "" : "disabled"} />
                                    <label for="inputOption_${i}_4">Option 4</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating mb-0">
                                    <input class="form-control" id="inputCorrectOption_${i}" type="text" name="inputCorrectOption_${i}" placeholder="Enter correct option" value="${
      val.correctOption
    }" ${isAdd ? "" : "disabled"} />
                                    <label for=inputCorrectOption_${i}"">Correct option</label>
                                </div>
                            </div>
                        </div>`;
  });

  return htmlString;
};

const copyPreviousQuestion = (subjectEl, isAdd) => {
  if (question.length > 0) {
    for (let i = 0; i < question.length; i++) {
      question[i].questionName = subjectEl.querySelector(
        `#question_${i}`
      ).value;
      question[i].option1 = subjectEl.querySelector(
        `#inputOption_${i}_1`
      ).value;
      question[i].option2 = subjectEl.querySelector(
        `#inputOption_${i}_2`
      ).value;
      question[i].option3 = subjectEl.querySelector(
        `#inputOption_${i}_3`
      ).value;
      question[i].option4 = subjectEl.querySelector(
        `#inputOption_${i}_4`
      ).value;
      question[i].correctOption = subjectEl.querySelector(
        `#inputCorrectOption_${i}`
      ).value;
    }
  }

  if (isAdd) {
    question.push({
      questionid: "",
      questionName: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "",
    });
  } else {
    if (question.length == 0) {
      question.push({
        questionid: "",
        questionName: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctOption: "",
      });
    }
  }
};
