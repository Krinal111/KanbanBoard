const addColumnBtn = document.querySelector("#addCol");
const boardDiv = document.querySelector("#col-board");
const addColumnInput = document.querySelector("#colName");
const data = JSON.parse(localStorage.getItem("data")) || {};
let lastId = localStorage.getItem("lastId") || 0;
let dragCard = null;

window.addEventListener("load", () => {
  loadData();
});

function loadData() {
  boardDiv.innerHTML = "";
  Object.keys(data).map((column) => {
    const cardWrapper = addColumnDiv(column);
    data[column].forEach((card) => {
      addCardDiv(card, cardWrapper, column);
    });
  });
}

// add column div
function addColumnDiv(columnName) {
  const columnDiv = document.createElement("div");
  columnDiv.setAttribute("class", "column");
  const columnHeader = document.createElement("h1");
  columnHeader.textContent = columnName;
  const addCardBtn = document.createElement("button");
  addCardBtn.textContent = "+ add a card";
  addCardBtn.setAttribute("class", "btn");
  addCardBtn.style.marginTop = "auto";
  const cardWrapper = document.createElement("div");
  cardWrapper.setAttribute("class", "card-wrapper");

  cardWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cardWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragCard) {
      const fromColumn = dragCard.columnName;
      const toColumn = columnName;

      data[fromColumn] = data[fromColumn].filter(
        (card) => card.id !== dragCard.cardObj.id
      );
      data[toColumn].push(dragCard.cardObj);

      localStorage.setItem("data", JSON.stringify(data));
      loadData();
    }
  });

  columnDiv.append(columnHeader, cardWrapper, addCardBtn);
  boardDiv.appendChild(columnDiv);
  addCardBtn.addEventListener("click", (e) =>
    addCard(e, columnName, cardWrapper)
  );
  return cardWrapper;
}

// add cards in columnDiv

function addCardDiv(cardObj, cardWrapper, columnName) {
  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");
  cardDiv.setAttribute("draggable", "true");

  cardDiv.addEventListener("dragstart", (e) => {
    dragCard = {
      card: cardDiv,
      cardObj,
      columnName,
    };
  });

  cardDiv.addEventListener("dragend", () => {
    dragCard = null;
  });

  const buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("class", "card-button");
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "deleteBtn");
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

  deleteBtn.addEventListener("click", () => {
    deleteCard(columnName, cardObj.id);
  });

  if (cardObj.mode === "save") {
    const cardContentDiv = document.createElement("div");
    cardContentDiv.setAttribute("class", "card-content");
    cardContentDiv.textContent = cardObj["content"];
    buttonDiv.appendChild(deleteBtn);
    cardDiv.append(cardContentDiv, buttonDiv);
  } else {
    const textArea = document.createElement("textarea");
    textArea.setAttribute("class", "textCard");
    textArea.addEventListener("input", (e) => {
      cardObj.content = e.target.value;
    });
    textArea.value = cardObj.content;
    const correctBtn = document.createElement("button");
    correctBtn.setAttribute("class", "correctBtn");
    correctBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    correctBtn.addEventListener("click", (e) => saveCard(textArea, e, cardObj));
    buttonDiv.append(correctBtn, deleteBtn);
    cardDiv.append(textArea, buttonDiv);
    localStorage.setItem("data", JSON.stringify(data));
  }
  cardWrapper.append(cardDiv);
}

function addColumn(e) {
  e.preventDefault();
  const columnName = addColumnInput.value;
  if (columnName) {
    const cardWrapper = addColumnDiv(columnName);
  }
}

function addCard(e, columnName, cardWrapper) {
  e.preventDefault();
  if (!data[columnName]) {
    data[columnName] = [];
  }
  const creatingCard = {
    id: lastId,
    content: "",
    mode: "active",
  };
  data[columnName].push(creatingCard);
  lastId++;
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("lastId", lastId);
  addCardDiv(creatingCard, cardWrapper, columnName);
}

function saveCard(textArea, e, saveObj) {
  e.preventDefault();
  const cardContentDiv = document.createElement("div");
  cardContentDiv.setAttribute("class", "card-content");
  cardContentDiv.textContent = textArea.value.trim();
  textArea.replaceWith(cardContentDiv);
  e.currentTarget.style.display = "none";
  saveObj.mode = "save";
  saveObj.content = textArea.value.trim();

  localStorage.setItem("data", JSON.stringify(data));
}

function deleteCard(columnName, id) {
  const filterdData = data[columnName].filter((card) => card.id !== id);
  data[columnName] = [...filterdData];
  localStorage.setItem("data", JSON.stringify(data));
  console.log("delete Card", columnName);
  loadData();
}

addColumnBtn.addEventListener("click", addColumn);
