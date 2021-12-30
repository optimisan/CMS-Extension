chrome.storage.local.get(["unenrol", "subjects"], (res) => {
  console.log(res);
  if (res.unenrol && (document.querySelectorAll(".alert, .alert-success").length == 0)) {
    goToUnenrol(res.subjects);
  }
  // goToUnenrol(res.subjects);
})
function goToUnenrol(subjects) {
  const origSubjects = [...subjects];
  const links = Array.from(document.querySelector("ul.unlist").getElementsByTagName("li"));
  links.forEach(li => {
    const a = li.getElementsByTagName("a")[0];//.getAttribute("title");
    a.setAttribute("target", "_blank");
    const subName = a.getAttribute("title");
    if (subjects) {
      for (let i = 0; i < subjects.length; i++) {
        const s = subjects[i];
        const regex = new RegExp(`${s.code}.*${s.section}`);
        // console.log(subName, "regex: ", regex);
        if (regex.test(subName)) {
          a.click();
          subjects.splice(i, 1);
          break;
        }
      }
    } else {
      // a.click();
    }
  })
  // For each subject in the CMS dashboard, we check if that is given by the user. If it is found, click on that 
  // subject and remove it from this `subject` array in this function.
  // If there are still some subjects left in the `subjects` array, it means that 
  // they were not in the dashboard list
  console.log("Subjects: ", subjects);
  origSubjects.forEach(orig => {
    subjects.forEach(s => {
      if (s.code == orig.code && s.section == orig.section) {
        orig.error = "Not found in enrolled list";
      }
    })
  })
  console.log(origSubjects);
  chrome.storage.local.set({ subjects: origSubjects }, (e) => {
    // chrome.runtime.sendMessage({ closeThis: true });
  })
}