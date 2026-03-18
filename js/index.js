// TODO: TIL 폼 등록 기능을 구현하세요
// 1. 폼 요소와 목록 요소를 querySelector로 선택합니다.
// 2. 폼의 submit 이벤트를 감지하여 새 TIL 항목을 목록에 추가합니다.

const form = document.querySelector("#til-form");
const list = document.querySelector("#til-list");

// 저장된 데이터 불러오기
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("tilData")) || [];
  saved.forEach(addItem);
});

// 제출 이벤트
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = document.querySelector("#til-date").value;
  const title = document.querySelector("#til-title").value;
  const content = document.querySelector("#til-content").value;

  const newItem = { date, title, content };

  addItem(newItem);
  saveItem(newItem);

  form.reset();
});

// 화면에 추가
function addItem(item) {
  const article = document.createElement("article");
  article.classList.add("til-item");

  article.innerHTML = `
    <time>${item.date}</time>
    <h3>${item.title}</h3>
    <p>${item.content}</p>
  `;

  list.appendChild(article);
}

// localStorage 저장
function saveItem(item) {
  const saved = JSON.parse(localStorage.getItem("tilData")) || [];
  saved.push(item);
  localStorage.setItem("tilData", JSON.stringify(saved));
}

/*
const form = document.querySelector("#til-form");
const list = document.querySelector("#til-list");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.querySelector("#til-date").value;
  const title = document.querySelector("#til-title").value;
  const content = document.querySelector("#til-content").value;

  const item = document.createElement("article");
  item.innerHTML = `
    <time>${date}</time>
    <h3>${title}</h3>
    <p>${content}</p>
  `;

  list.appendChild(item);
});
*/