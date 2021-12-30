document.getElementsByTagName("button")[0].addEventListener("click", () => {
  chrome.tabs.create({ url: "https://cms.bits-hyderabad.ac.in/my/" })
}
)
document.getElementsByTagName("button")[1].addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
}
)
document.addEventListener("click", (e) => {
  if (e.target.href) {
    chrome.tabs.create({ url: e.target.href });
  }
  if (e.target.tagName == "I" || e.target.tagName == "i") {
    const ID = e.target.id;
    chrome.storage.local.get("recent", (res) => {
      let arr = res.recent;
      for (let i = 0; i < arr.length; i++) {
        const s = arr[i];
        if (s.id == ID) {
          arr.splice(i, 1);
          break;
        }
      }
      chrome.storage.local.set({ recent: arr }, (e) => {
        showRecents(arr);
      });
    })
  }
})
// window.onload = function () {
//   let html = "";
//   chrome.storage.local.get("recent", (res) => {
//     const arr = res.recent;
//     arr.forEach(s => {
//       html += `<a href="https://cms.bits-hyderabad.ac.in/course/view.php?id=${s.id}">${s.title}</a>`;
//     });
//     document.getElementById("recent").innerHTML = html;
//   })

// }
let html = "";
chrome.storage.local.get("recent", (res) => {
  const arr = res.recent;
  showRecents(arr);
  // arr.forEach(s => {
  //   html += `<a href="https://cms.bits-hyderabad.ac.in/course/view.php?id=${s.id}">${s.title}<i id="${s.id}" class="fas fa-times"></i></a>`;
  // });
  // document.getElementById("recent").innerHTML = html;
})
function showRecents(arr) {
  let html = "";
  arr.reverse().forEach(s => {
    html += `<a href="https://cms.bits-hyderabad.ac.in/course/view.php?id=${s.id}">${s.title}<i id="${s.id}" class="fas fa-times"></i></a>`;
  });
  if (html == "") html = "No courses recently accessed"
  document.getElementById("recent").innerHTML = html;
}