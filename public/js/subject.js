window.addEventListener("DOMContentLoaded", (event) => {
  console.log(professors);
  if (subjects.length > 0) {
    const subjectEl = document.getElementById("subject");
    subjectEl.innerHTML = updateSubjects();
    updateProfessors();
  } else {
    addSubject();
  }
});

const addSubject = () => {
  const subjectEl = document.getElementById("subject");
  copyPreviousSubject(subjectEl, true);
  subjectEl.innerHTML = updateSubjects();
  updateProfessors();
};
const removeSubject = (i) => {
  const subjectEl = document.getElementById("subject");
  copyPreviousSubject(subjectEl, false);
  subjects.splice(i, 1);
  subjectEl.innerHTML = updateSubjects();
  updateProfessors();
};
const updateSubjects = () => {
  let htmlString = "";
  let professor = professors
    .map(
      (professor) =>
        `<option value="${professor.id}">${professor.name}</option>`
    )
    .join("");

  const addButton = `<div class="col-md-2">
                        <div class="mb-3 mb-md-0">
                            <button type="button" class="btn btn-success btn-block w-100 h-100" onclick="addSubject()">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>`;

  subjects.forEach((val, i) => {
    const deleteButton = `<div class="col-md-2">
                                <div class="mb-3 mb-md-0">
                                    <button type="button" class="btn btn-danger btn-block w-100 h-100" onclick="removeSubject(${i})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>`;
    htmlString += `<div class="row mb-3" >
      <input class="form-control" id="inputSubjectId_${i}" type="hidden" name="subjectid_${i}" value="${
      val.subjectId
    }" />
                            <div class="col-md-${isAdd ? "4" : "6"}">
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="inputSubjectName_${i}" type="text" name="subjectname_${i}" placeholder="Enter subject name" value="${
      val.subjectName
    }" ${isAdd ? "" : "disabled"} required />
                                    <label for="inputSubjectName_${i}">Subject name</label>
                                </div>
                            </div>
                            <div class="col-md-${isAdd ? "4" : "6"}">
                                <div class="form-floating mb-3">
                                    <select class="form-control" id="selectProfessor_${i}" name="professor_${i}" placeholder="Select Professor" ${
      isAdd ? "" : "disabled"
    } required>
                                    ${professor}
                                    </select>
                                    <label for="selectProfessor_${i}">Select Professor</label>
                                </div>
                            </div>
                            ${
                              isAdd && i == subjects.length - 1 ? addButton : ""
                            }
                            ${
                              isAdd &&
                              subjects.length !== 1 &&
                              i < subjects.length
                                ? deleteButton
                                : ""
                            }
                        </div>`;
  });

  return htmlString;
};

const copyPreviousSubject = (subjectEl, isAdd) => {
  if (subjects.length > 0) {
    for (let i = 0; i < subjects.length; i++) {
      subjects[i].subjectId = subjectEl.querySelector(
        `#inputSubjectId_${i}`
      ).value;
      subjects[i].subjectName = subjectEl.querySelector(
        `#inputSubjectName_${i}`
      ).value;
      subjects[i].assignedProfessor = subjectEl.querySelector(
        `#selectProfessor_${i}`
      ).value;
    }
  }

  if (isAdd) {
    subjects.push({
      subjectId: "",
      subjectName: "",
      assignedProfessor: "",
    });
  } else {
    if (subjects.length == 0) {
      subjects.push({
        subjectId: "",
        subjectName: "",
        assignedProfessor: "",
      });
    }
  }
};

const updateProfessors = () => {
  subjects.forEach((value, i) => {
    document.getElementById(`selectProfessor_${i}`).value =
      value.assignedProfessor;
  });
};
