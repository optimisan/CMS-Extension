window.onload = () => {
  tableFromStorage();
}
document.getElementById("enrol").addEventListener("click", () => {
  trimInputs();
  const [subjects, allCodesAreValid] = getSubjectsFromTextbox();
  const subjectCodes = document.getElementById("codes").value.toUpperCase().split("\n");
  // const regex = /\w+ F\d{3}/g;
  // const sectionRegex = /[TLP]\d+/g;
  // let allCodesAreValid = true;
  // const subjects = subjectCodes.map(c => {
  //   const matches1 = c.match(regex);
  //   if (matches1 && matches1.length == 1) {
  //     const matches2 = c.match(sectionRegex);
  //     if (matches2 && matches2.length == 1) {
  //       return { subject: c, code: matches1[0], section: matches2[0], enrolled: false, isValid: true };
  //     } else {
  //       allCodesAreValid = false;
  //       return { subject: c, code: matches1[0], isValid: false };
  //     }
  //   } else {
  //     allCodesAreValid = false;
  //     return { subject: c, code: c, enrolled: false, isValid: false };
  //   }
  // });
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
})
function getSubjectsFromTextbox() {
  const subjectCodes = document.getElementById("codes").value.toUpperCase().split("\n");
  const regex = /\w+ F\d{3}/g;
  const sectionRegex = /[TLP]\d+/g;
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
    let html = "";
    res.subjects.forEach(s => {
      html += `
    <tr class="${s.enrolled ? 'green' : s.error ? 'red' : s.unenrolled ? 'black' : ''}">
      <td>${s.code}</td>
      <td>${s.section}</td>
      <td>${s.enrolled ? 'Enrolled' : (s.error ? s.error : s.unenrolled ? 'Unenrolled' : 'Loading')}</td>
    </tr>`;
    })
    document.getElementById("tbody").innerHTML = html;
  })
}
chrome.storage.onChanged.addListener((a, b) => {
  tableFromStorage();
})