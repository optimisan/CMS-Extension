document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowRight") {
    const ele = document.querySelectorAll("li.next-discussion")[0].children[0];
    const html = `<div class="cms-arrow" id="cms-arrow">${ele.innerHTML}</div>`;
    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeEnd", html);
    ele.click();
  }
  if (e.code === "ArrowLeft") {
    const ele = document.querySelectorAll("li.prev-discussion")[0].children[0];
    const html = `<div class="cms-arrow" id="cms-arrow">${ele.innerHTML}</div>`;
    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeEnd", html);
    ele.click();
  }
})