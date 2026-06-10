let chars = JSON.parse(localStorage.getItem("chars")) || [];

let editingIndex = null;

// =====================
// STAMINA ENGINE
// =====================

function updateStamina(char) {
  let now = Date.now();
  let diff = Math.floor((now - char.lastUpdate) / 60000);

  let stamina = char.stamina;

  while (diff > 0 && stamina < 2520) {

    if (stamina > 2340) {
      let gain = Math.min(diff / 6, 2520 - stamina);
      stamina += gain;
      diff -= gain * 6;
    } else {
      let gain = Math.min(diff / 3, 2520 - stamina);
      stamina += gain;
      diff -= gain * 3;
    }
  }

  char.stamina = Math.floor(stamina);
  char.lastUpdate = now;

  return char;
}

// =====================
// RENDER
// =====================

function render() {
  let list = document.getElementById("charList");
  list.innerHTML = "";

  chars.forEach((c, index) => {

    c = updateStamina(c);

    let color = "green";
    if (c.stamina < 900) color = "red";
    else if (c.stamina < 2340) color = "orange";

    list.innerHTML += `
      <div class="card" onclick="openEdit(${index})">

        <button class="delete-btn" onclick="deleteChar(event, ${index})">X</button>

        <div class="name">${c.name}</div>
        <div class="vocation">${c.vocation}</div>

        <div class="bar">
          <div class="fill ${color}" style="width:${(c.stamina/2520)*100}%"></div>
        </div>

        <div>${formatTime(c.stamina)}</div>

      </div>
    `;
  });

  save();
}

// =====================
// FORMAT TIME
// =====================

function formatTime(min) {
  let h = Math.floor(min / 60);
  let m = min % 60;
  return `${h}:${m.toString().padStart(2,'0')}h`;
}

// =====================
// ADD CHAR (HORAS + MINUTOS)
// =====================

function addChar() {
  let name = document.getElementById("name").value;
  let vocation = document.getElementById("vocation").value;

  let hours = parseInt(document.getElementById("hours").value) || 0;
  let minutes = parseInt(document.getElementById("minutes").value) || 0;

  let stamina = (hours * 60) + minutes;

  if (stamina === 0) {
    stamina = 2520; // padrão full
  }

  chars.push({
    name,
    vocation,
    stamina,
    lastUpdate: Date.now()
  });

  closeAddModal();
  render();
}

// =====================
// EDIT CHAR (HORAS + MINUTOS)
// =====================

function openEdit(index) {
  editingIndex = index;

  let stamina = chars[index].stamina;

  let hours = Math.floor(stamina / 60);
  let minutes = stamina % 60;

  document.getElementById("editHours").value = hours;
  document.getElementById("editMinutes").value = minutes;

  document.getElementById("editModal").classList.remove("hidden");
}

function saveEdit() {
  let hours = parseInt(document.getElementById("editHours").value) || 0;
  let minutes = parseInt(document.getElementById("editMinutes").value) || 0;

  let stamina = (hours * 60) + minutes;

  chars[editingIndex].stamina = stamina;
  chars[editingIndex].lastUpdate = Date.now();

  save();
  closeEditModal();
  render();
}

// =====================
// DELETE CHAR
// =====================

function deleteChar(event, index) {
  event.stopPropagation();

  chars.splice(index, 1);

  save();
  render();
}

// =====================
// STORAGE
// =====================

function save() {
  localStorage.setItem("chars", JSON.stringify(chars));
}

// =====================
// MODALS
// =====================

function openAddModal() {
  document.getElementById("addModal").classList.remove("hidden");
}

function closeAddModal() {
  document.getElementById("addModal").classList.add("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

// =====================
// INIT
// =====================

render();