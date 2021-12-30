const title = document.title;
chrome.storage.local.get(["subjects", "unenrol"], (res) => {
  const newSubjects = res.subjects;
  newSubjects.forEach(s => {
    if (title.includes(s.code) && title.includes(s.section)) {
      if (res.unenrol) {
        // s.unenrolled = true;
      }
      else {
        s.error = "Already enrolled"
        chrome.storage.local.set({ subjects: newSubjects }, (e) => {
          chrome.runtime.sendMessage({ closeThis: true });
        });
      }
    }
  });
  chrome.storage.local.set({ subjects: newSubjects }, (e) => { });
  if (res.unenrol) unenrol();
})
function unenrol() {
  document.querySelector("div.dropdown-item a[role=\"menuitem\"]").click();
}