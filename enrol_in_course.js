const title = document.title;
const urlParams = new URLSearchParams(window.location.search);
const fromCMSExtension = urlParams.get('fromCMS');
const id = urlParams.get("id");
chrome.storage.local.get(['subjects', "unenrol"], function (result) {
  if (result.unenrol) {
    document.querySelector("div.dropdown-item a[role=\"menuitem\"]").click();
    return;
  }
  const newSubjects = result.subjects;
  for (let i = 0; i < newSubjects.length; i++) {
    const subject = newSubjects[i];
    if (title.includes(subject.code) && title.includes(subject.section)) {
      subject.enrolled = true;
      const submitButton = document.querySelector('input[type="submit"]');
      if (submitButton)
        submitButton.click();
      else {
        subject.enrolled = false;
        subject.error = "Already enrolled";
      }
      break;
    }
  }
  // newSubjects.forEach(subject => {
  //   if (title.includes(subject.code) && title.includes(subject.section)) {
  //     subject.enrolled = true;
  //     const submitButton = document.querySelector('input[type="submit"]')
  //     submitButton.click();
  //   }
  // })
  chrome.storage.local.set({ subjects: newSubjects })
});