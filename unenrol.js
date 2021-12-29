chrome.storage.local.get(["unenrol", "subjects"], (res) => {
  if (res.unenrol) {
    goToUnenrol(res.subjects);
  }
  // goToUnenrol(res.subjects);
})
function goToUnenrol(subjects) {
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
}