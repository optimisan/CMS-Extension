// chrome.storage.local TODO Mark this subject unenrolled in storage
let subName = document.querySelectorAll("li.breadcrumb-item a")[1].innerText;
if (subName.trim() == "Courses") {
  subName = document.getElementById("modal-content").getElementsByTagName("p")[0].innerText;
}
chrome.storage.local.get("subjects", (res) => {
  let found = false;
  let newSubjects = res.subjects;
  console.log("subName", subName);
  newSubjects.forEach(s => {
    console.log(s);
    if (!found && !s.unenrolled && subName.includes(s.code) && subName.includes(s.section)) {
      found = true;
      s.unenrolled = true;
      chrome.storage.local.set({ subjects: newSubjects }, (e) => {
        document.querySelector("button[type=\"submit\"]").click();
      })
    }
  });
})