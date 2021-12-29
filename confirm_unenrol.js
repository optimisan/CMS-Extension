// chrome.storage.local TODO Mark this subject unenrolled in storage
const subName = document.querySelectorAll("li.breadcrumb-item a")[1].innerText;
chrome.storage.local.get("subjects", (res) => {
  let found = false;
  let newSubjects = res.subjects;
  newSubjects.forEach(s => {
    if (!found && !s.unenrolled && subName.includes(s.code) && subName.includes(s.section)) {
      document.querySelector("button[type=\"submit\"]").click();
      found = true;
      s.unenrolled = true;
    }
  });
})