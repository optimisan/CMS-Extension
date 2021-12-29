const subjects = ["CS F214 T2"];
// Open the options page on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // chrome.tabs.create({
    //   url: 'https://google.com'
    // });
    chrome.runtime.openOptionsPage(() => {
      console.log("Success");
    });
  }
});
// Get the message from Options page to enrol
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Background script
  if (message.closeThis) chrome.tabs.remove(sender.tab.id);

  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  // if (message.greeting === "hello") sendResponse({ farewell: "goodbye" });
  // if (message.enrolInCourses)
  //   subjects.forEach(code => {
  //     chrome.tabs.create({
  //       url: `https://cms.bits-hyderabad.ac.in/course/search.php?areaids=core_course-course&q=${code}&fromCMS=1`
  //     })
  //   })
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    if (key == "subjects") {
      let allUnenrolled = true;
      // or all enrolled
      newValue.forEach(s => {
        allUnenrolled = s.unenrolled || s.enrolled;
      });
      if (allUnenrolled) {
        chrome.storage.local.set({ unenrol: true }, (e) => { });
        chrome.storage.local.remove("subjects");
      }
    }
  }
});