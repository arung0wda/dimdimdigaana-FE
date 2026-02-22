const API = "https://dimdimdigaana-be.onrender.com/api/users";

async function createUser() {
  const user = {
    name: document.getElementById("name").value,
    age: Number(document.getElementById("age").value),
    dob: document.getElementById("dob").value
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
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
    li.innerText = `${u.name} (${u.age}) - ${u.dob}`;
    list.appendChild(li);
  });
}

loadUsers();