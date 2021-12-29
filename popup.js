document.getElementsByTagName("button")[0].addEventListener("click", () => {
  chrome.tabs.create({ url: "https://cms.bits-hyderabad.ac.in/my/" })
}
)
document.getElementsByTagName("button")[1].addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
}
)