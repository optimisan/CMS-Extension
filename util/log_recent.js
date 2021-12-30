const doc_title = document.title;
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('id');
chrome.storage.local.get(["recent", "logging"], (res) => {
  // if (!logging) return;
  let arr = res.recent ?? [];
  let index = -1;
  arr.forEach((s, i) => {
    if (s.id == ID) index = i;
  })
  if (index > -1)
    arr.splice(index, 1);
  arr.push({ id: ID, title: doc_title.substring(8) });
  chrome.storage.local.set({ recent: arr });
})