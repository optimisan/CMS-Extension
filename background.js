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
  console.log(sender.tab);
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
        allUnenrolled = s.unenrolled || s.enrolled || s.error;
      });
      if (allUnenrolled) {
        chrome.storage.local.set({ unenrol: false }, (e) => { });
        // chrome.storage.local.remove("subjects");
      }
    }
  }
});
// Get CMS details from webpage

// Listen to message from chronofactorem
chrome.runtime.onConnectExternal.addListener(function (port) {
  console.log("Connected...")
  port.onMessage.addListener(async function (msg) {
    if (!msg.getCMSDetails) {
      port.disconnect();
      return;
    }

    try {
      const cmsDetails = await getCMSDetails();
      console.log(cmsDetails)
      port.postMessage(cmsDetails);
      port.disconnect();
    } catch (error) {
      console.error(error);
      port.postMessage({ error });
      port.disconnect();
    }

  })
})

async function getCMSDetails() {
  // Web Service Token
  // Open a new tab and get the token
  const tab = await chrome.tabs.create({
    url: "https://cms.bits-hyderabad.ac.in/user/managetoken.php?fromCMS=1",
    active: false,
  });
  // wait till the above tab is loaded
  await new Promise((resolve, reject) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
  const details = await chrome.tabs.sendMessage(tab.id, { getCMSDetails: true });
  return new Promise((resolve, reject) => {
    chrome.cookies.get({ url: "https://cms.bits-hyderabad.ac.in", name: "MoodleSession" }, function (cookie) {
      if (cookie) {
        resolve({ ...details, cookie: cookie.value });
      } else {
        reject("Cookie not found");
      }
    });
  });
}