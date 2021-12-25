const title = document.title;
const urlParams = new URLSearchParams(window.location.search);
const fromCMSExtension = urlParams.get('fromCMS');
const id = urlParams.get("id");
chrome.storage.local.get('subjects', function (result) {
  const newSubjects = result.subjects;
  for (let i = 0; i < newSubjects.length; i++) {
    const subject = newSubjects[i];
    if (title.includes(subject.code) && title.includes(subject.section)) {
      subject.enrolled = true;
      const submitButton = document.querySelector('input[type="submit"]')
      submitButton.click();
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