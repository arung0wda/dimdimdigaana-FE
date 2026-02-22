const API = "https://dimdimdigaana-be.onrender.com/api/users";

async function createUser() {
  const payload = {
    username: document.getElementById("username").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    dob: document.getElementById("dob").value
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  loadUsers();
}

async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  const list = document.getElementById("users");
  list.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.innerText = `${u.username} - ${u.firstName} ${u.lastName} (${u.dob})`;
    list.appendChild(li);
  });
}

loadUsers();