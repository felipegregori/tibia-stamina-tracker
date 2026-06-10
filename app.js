let chars = JSON.parse(localStorage.getItem("chars")) || [];
let editingIndex = null;

// =====================
// STAMINA ENGINE (CORRIGIDO - CONTRA LOOP)
// =====================
function updateStamina(char) {
  let now = Date.now();
  let diff = Math.floor((now - char.lastUpdate) / 60000);

  if (diff <= 0) return char;

  let stamina = char.stamina;

  while (diff > 0 && stamina < 2520) {
    if (stamina >= 2340) {
      let staminaNeeded = 2520 - stamina;
      let timeNeeded = staminaNeeded * 6;

      if (diff >= timeNeeded) {
        stamina = 2520;
        diff -= timeNeeded;
      } else {
        stamina += diff / 6;
        diff = 0;
      }
    } else {
      let staminaNeeded = 2340 - stamina;
      let timeNeeded = staminaNeeded * 3;

      if (diff >= timeNeeded) {
        stamina = 2340;
        diff -= timeNeeded;
      } else {
        stamina += diff / 3;
        diff = 0;
      }
    }
  }

  char.stamina = Math.min(2520, Math.floor(stamina));
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
        <div class="name">${c.name || "Sem Nome"}</div>
        <div class="vocation">${c.vocation}</div>
        <div class="bar">
          <div class="fill ${color}" style="width:${(c.stamina / 2520) * 100}%"></div>
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
  return `${h}:${m.toString().padStart(2, '0')}h`;
}

// =====================
// ADD CHAR
// =====================
function addChar() {
  let nameInput = document.getElementById("name");
  let vocationInput = document.getElementById("vocation");
  let hoursInput = document.getElementById("hours");
  let minutesInput = document.getElementById("minutes");

  let name = nameInput.value.trim();
  let vocation = vocationInput.value;
  let hours = parseInt(hoursInput.value) || 0;
  let minutes = parseInt(minutesInput.value) || 0;

  let stamina = (hours * 60) + minutes;

  if (stamina === 0) stamina = 2520;
  if (stamina > 2520) stamina = 2520;

  chars.push({
    name,
    vocation,
    stamina,
    lastUpdate: Date.now()
  });

  nameInput.value = "";
  hoursInput.value = "";
  minutesInput.value = "";
  vocationInput.selectedIndex = 0;

  closeAddModal();
  render();
}

// =====================
// EDIT CHAR
// =====================
function openEdit(index) {
  editingIndex = index;

  chars[index] = updateStamina(chars[index]);
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
  if (stamina > 2520) stamina = 2520;

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
  if (confirm("Deseja deletar este personagem?")) {
    chars.splice(index, 1);
    save();
    render();
  }
}

function save() {
  localStorage.setItem("chars", JSON.stringify(chars));
}

// =====================
// MODALS
// =====================
function openAddModal() { document.getElementById("addModal").classList.remove("hidden"); }
// Limpa os campos se fechar sem salvar também
function closeAddModal() { 
  document.getElementById("addModal").classList.add("hidden"); 
  document.getElementById("name").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
}
define: function closeEditModal() { document.getElementById("editModal").classList.add("hidden"); }

// Auto-update a cada 1 minuto
setInterval(render, 60000);

render();

// ... resto do seu código lá em cima ...

// Auto-update a cada 1 minuto
setInterval(render, 60000);

// =====================
// INIT
// =====================
render();

// REGISTRA O SERVICE WORKER PARA PERMITIR TELA CHEIA (PWA) NO CELULAR
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker Registrado com Sucesso!'))
    .catch((err) => console.log('Erro ao registrar Service Worker:', err));
}