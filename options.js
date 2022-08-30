window.onload = () => {
  tableFromStorage();
  chrome.storage.local.get("openedOnce", ({ openedOnce }) => {
    if (!openedOnce) {
      document.getElementById("about").scrollIntoView();
      chrome.storage.local.set({ openedOnce: true });
    }
  })
}
function enrolInCourses() {
  trimInputs();
  const [subjects, allCodesAreValid] = getSubjectsFromTextbox();
  const subjectCodes = document.getElementById("codes").value.toUpperCase().split("\n");
  createTable(subjects);
  if (!allCodesAreValid) UIkit.notification('Course code number is required', "danger");
  else {
    console.log({ subjects });
    chrome.storage.local.set({ subjects }, (e) => {
      chrome.storage.local.remove("unenrol");
      subjectCodes.forEach(subject => {
        chrome.tabs.create({
          active: false,
          url: `https://cms.bits-hyderabad.ac.in/course/search.php?areaids=core_course-course&q=${subject}&fromCMS=1`
        })
      });
    })
  }
}
document.getElementById("enrol").addEventListener("click", enrolInCourses);

document.getElementById("unenrol-all").addEventListener("click", (e) => {
  UIkit.modal.confirm("Do you want to unenrol from all courses? This action cannot be interrupted or reverted.").then(function () {
    chrome.storage.local.set({ subjects: null, unenrol: true, unenrol_all: true });
    chrome.tabs.create({ url: "https://cms.bits-hyderabad.ac.in/my/" });
  })
})
function getSubjectsFromTextbox() {
  const subjectCodes = document.getElementById("codes").value.toUpperCase().split("\n");
  //take first 3 elements only
  if (subjectCodes.length > 3) {
    const remaining = subjectCodes.splice(3);
    subjectCodes.length = 3;
    //replace "codes" textbox with remaining elements
    document.getElementById("codes").value = remaining.join("\n");
    // document.getElementById("codes").value = subjectCodes.join("\n");
    // subjectCodes.length = 3;
    UIkit.notification('Only 3 courses can be worked with at once. Click "Enrol" once these are done.', "danger");
  }
  const regex = /\w+ F\d{3}/g;
  const sectionRegex = /([TLP]\d+)|\bL\b/g;
  let allCodesAreValid = true;
  const subjects = subjectCodes.map(c => {
    const matches1 = c.match(regex);
    if (matches1 && matches1.length == 1) {
      const matches2 = c.match(sectionRegex);
      if (matches2 && matches2.length == 1) {
        return { subject: c, code: matches1[0], section: matches2[0], enrolled: false, isValid: true };
      } else {
        allCodesAreValid = false;
        return { subject: c, code: matches1[0], isValid: false };
      }
    } else {
      allCodesAreValid = false;
      return { subject: c, code: c, enrolled: false, isValid: false };
    }
  });
  return [subjects, allCodesAreValid];
}
document.getElementById("unenrol").addEventListener("click", (e) => {
  trimInputs();
  UIkit.modal.confirm('Do you want to unenrol from these courses?').then(function () {
    // Yes
    const [subjects, allCodesAreValid] = getSubjectsFromTextbox();
    const subjectCodes = document.getElementById("codes").value.toUpperCase().split("\n");
    createTable(subjects);
    if (!allCodesAreValid) UIkit.notification('Course code number is required', "danger");
    else {
      console.log({ subjects });
      chrome.storage.local.set({ subjects }, (e) => {
        chrome.storage.local.set({ unenrol: true }, (e) => {
          chrome.tabs.create({ active: false, url: "https://cms.bits-hyderabad.ac.in/my/" })
        })
      })
    }
  }, function () {
    // console.log('Rejected.')
  });

})
function trimInputs() {
  document.getElementById("codes").value = document.getElementById("codes").value.
    replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
    replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
    replace(/\n +/, "\n")
    .replace(/(^\n+)|\n+$/, ""); // Removes spaces after newlines
  return;
}
function createTable(subjects) {
  const table = document.getElementById("tbody");
  let html = "";
  subjects.forEach(s => {
    html += s.isValid ? `<tr id="${s.code}"><td>${s.code}</td><td>${s.section}</td><td></td></tr>` :
      `<tr class="red"><td>${s.subject}</td><td>--</td><td>Invalid course code</tr>`;
  })
  table.innerHTML = html;
}
function tableFromStorage() {
  chrome.storage.local.get('subjects', (res) => {
    showTableFromSubjects(res.subjects);
  })
}
chrome.storage.onChanged.addListener((a, b) => {
  tableFromStorage();
  const subjectCodes = document.getElementById("codes").value;
  // if (subjectCodes.trim() !== "") {
  //   showTableFromSubjects(a.subjects.newValue, true);
  //   enrolInCourses();
  // } else
  // showTableFromSubjects(a.subjects.newValue);
})
function processRemainingSubjects() {
  const subjectCodes = document.getElementById("codes").value;
  if (subjectCodes.trim() !== "") {
    enrolInCourses();
    return true;
  }
  return false;
}
function showTableFromSubjects(subjects, append = false) {
  let html = "";
  subjects.forEach(s => {
    html += `
    <tr class="${s.enrolled ? 'green' : s.error ? 'red' : s.unenrolled ? 'black' : ''}">
      <td>${s.code}</td>
      <td>${s.section}</td>
      <td>${s.enrolled ? 'Enrolled' : (s.error ? s.error : s.unenrolled ? 'Unenrolled' : 'Loading')}</td>
    </tr>`;
  })
  if (append) {
    document.getElementById("tbody").innerHTML += html;
  } else
    document.getElementById("tbody").innerHTML = html;
}
