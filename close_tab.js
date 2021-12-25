const title = document.title;
chrome.storage.local.get("subjects", (res) => {
  res.subjects.array.forEach(s => {
    if (title.includes(s.code) && title.includes(s.section)) {
      chrome.runtime.sendMessage({ closeThis: true });
      break;
    }
  });
})