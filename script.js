const saved = localStorage.getItem("salaryEntries");
let entries = saved ? JSON.parse(saved) : [];

const form = document.getElementById("entryForm");
const cardsContainer = document.getElementById("entryCards");
const summary = document.getElementById("summary");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = document.getElementById("description").value;
  const amt = parseFloat(document.getElementById("amount").value);
  const type = document.querySelector('input[name="type"]:checked').value;

  entries.push({ desc, amt, type });
  form.reset();

  renderEntries();
});

function renderEntries() {
  cardsContainer.innerHTML = "";
  let income = 0,
    expense = 0;

  entries.forEach((entry, index) => {
    if (entry.type === "income") income += entry.amt;
    else expense += entry.amt;

    const percent =
      entry.type === "expense" && income > 0
        ? ((entry.amt / income) * 100).toFixed(1) + "%"
        : "-";

    const card = document.createElement("div");
    card.className = `entry-card ${
      entry.type === "income" ? "income-row" : "expense-row"
    }`;
    card.innerHTML = `
      <div class="entry-header">${entry.desc}</div>
      <div class="entry-detail">₹${entry.amt.toFixed(2)}</div>
      ${
        entry.type !== "income"
          ? `<div class="entry-detail">Used: ${percent}</div>`
          : ``
      }
      <div class="actions">
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  const balance = income - expense;
  summary.textContent = `Total Balance: ₹${balance.toFixed(
    2
  )} | Income: ₹${income.toFixed(2)} | Expense: ₹${expense.toFixed(2)}`;

  // 🔥 Save to localStorage
  localStorage.setItem("salaryEntries", JSON.stringify(entries));
}

function deleteEntry(index) {
  entries.splice(index, 1);
  renderEntries();
}

function editEntry(index) {
  const entry = entries[index];
  document.getElementById("description").value = entry.desc;
  document.getElementById("amount").value = entry.amt;
  document.getElementById("type").value = entry.type;

  entries.splice(index, 1);
  renderEntries();
}

renderEntries();
