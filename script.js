// Database simulation
const akun = {
  mahasiswa: { password: "12345", role: "user" },
  admin: { password: "admin", role: "admin" }
};

let currentUser  = null;
let dataKartu = [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const mainForm = document.getElementById('mainForm');
const lostForm = document.getElementById('lostForm');
const cardContainer = document.getElementById('cardContainer');
const tableContainer = document.getElementById('tableContainer');
const loginError = document.getElementById('loginError');
const username = document.getElementById('username');
const password = document.getElementById('password');
const nama = document.getElementById('nama');
const npm = document.getElementById('npm');
const prodi = document.getElementById('prodi');
const tahun = document.getElementById('tahun');
const telepon = document.getElementById('telepon');
const jenis = document.getElementById('jenis');
const plat = document.getElementById('plat');
const namaLagi = document.getElementById('namaLagi');
const npmLagi = document.getElementById('npmLagi');
const jenisLagi = document.getElementById('jenisLagi');
const platLagi = document.getElementById('platLagi');

const userRoleSpan = document.getElementById('userRole');

const outputNama = document.getElementById('outputNama');
const outputNPM = document.getElementById('outputNPM');
const outputProdi = document.getElementById('outputProdi');
const outputTahun = document.getElementById('outputTahun');
const outputTelepon = document.getElementById('outputTelepon');
const outputPlat = document.getElementById('outputPlat');
const outputJenis = document.getElementById('outputJenis');
const cardNote = document.getElementById('cardNote');

const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
const printBtn = document.getElementById('printBtn');
const printBtnRusak = document.getElementById('printBtnRusak');
const dataKartuBtn = document.getElementById('dataKartuBtn');
const lostFormBtn = document.getElementById('lostFormBtn');

// Initialize app
window.onload = () => {
  const data = localStorage.getItem("dataKartu");
  if (data) {
    dataKartu = JSON.parse(data);
  }
  setInitialView();
};

// Set initial view when page loads
function setInitialView() {
  loginForm.classList.remove('hidden');
  dashboard.classList.add('hidden');
  mainForm.classList.add('hidden');
  lostForm.classList.add('hidden');
  cardContainer.classList.add('hidden');
  tableContainer.classList.add('hidden');
}

// Login function
function login() {
  const user = username.value.trim();
  const pass = password.value.trim();

  if (akun[user] && akun[user].password === pass) {
    currentUser  = user;
    loginError.textContent = "";
    loginForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    userRoleSpan.textContent = akun[user].role === "admin" ? "Admin" : "Mahasiswa";

    // All roles can access the lost card form
    lostFormBtn.classList.remove('hidden');

    // Only admin can see card data
    if (akun[user].role === "admin") {
      dataKartuBtn.classList.remove('hidden');
    } else {
      dataKartuBtn.classList.add('hidden');
    }

    showForm('mainForm');
    displayTable();
    resetPrintButtons();
    username.value = password.value = "";
  } else {
    loginError.textContent = "Username atau password salah!";
  }
}

// Toggle password visibility
function togglePasswordVisibility() {
  const passwordField = password;
  const checkbox = document.getElementById("showPasswordCheck");
  passwordField.type = checkbox.checked ? "text" : "password";
}

// Logout function
function logout() {
  currentUser  = null;
  setInitialView();
}

// Show specific form based on user role
function showForm(formId) {
  mainForm.classList.add('hidden');
  lostForm.classList.add('hidden');
  tableContainer.classList.add('hidden');
  cardContainer.classList.add('hidden');

  if (formId === 'tableContainer') {
    if (akun[currentUser].role !== "admin") return;
    tableContainer.classList.remove('hidden');
  } else if (formId === 'mainForm') {
    mainForm.classList.remove('hidden');
  } else if (formId === 'lostForm') {
    lostForm.classList.remove('hidden');
  }
}


// Function to create a new card
function buatKartu() {
  if (!nama.value || !npm.value || !prodi.value || !tahun.value || !telepon.value || !jenis.value || !plat.value) {
    alert("Isi semua data!");
    return;
  }

  const data = {
    nama: nama.value,
    npm: npm.value,
    prodi: prodi.value,
    tahun: tahun.value,
    telepon: telepon.value,
    plat: plat.value,
    jenis: jenis.value,
    tanggal: new Date().toLocaleDateString(),
    diambil: false,
    rusak: false
  };

  dataKartu.push(data);
  localStorage.setItem("dataKartu", JSON.stringify(dataKartu));
  showCard(data, false);
  displayTable();
  clearMainFormInputs();
}

// Function to create a damaged card
function buatKartuRusak() {
  if (!namaLagi.value || !npmLagi.value || !jenisLagi.value || !platLagi.value) {
    alert("Lengkapi semua data!");
    return;
  }

  const data = {
    nama: namaLagi.value,
    npm: npmLagi.value,
    prodi: "-",
    tahun: "-",
    telepon: "-",
    plat: platLagi.value,
    jenis: jenisLagi.value,
    tanggal: new Date().toLocaleDateString(),
    diambil: false,
    rusak: true
  };

  dataKartu.push(data);
  localStorage.setItem("dataKartu", JSON.stringify(dataKartu));
  showCard(data, true);
  displayTable();
  clearLostFormInputs();
}

// Clear input fields in main form
function clearMainFormInputs() {
  nama.value = npm.value = prodi.value = tahun.value = telepon.value = jenis.value = plat.value = "";
}

// Clear input fields in lost form
function clearLostFormInputs() {
  namaLagi.value = npmLagi.value = jenisLagi.value = platLagi.value = "";
}

// Display the card details
function showCard(data, rusak) {
  outputNama.textContent = data.nama;
  outputNPM.textContent = data.npm;
  outputProdi.textContent = data.prodi;
  outputTahun.textContent = data.tahun;
  outputTelepon.textContent = data.telepon;
  outputPlat.textContent = data.plat;
  outputJenis.textContent = data.jenis;

  if (rusak) {
    cardNote.textContent = "(Kartu Rusak/Hilang) Note: Pengambilan kartu dikenakan biaya Rp. 50.000";
  } else {
    cardNote.textContent = "";
  }
  document.getElementById("printCardBtn").disabled = false;
  

  cardContainer.classList.remove('hidden');
  mainForm.classList.add('hidden');
  lostForm.classList.add('hidden');
}

// Print card function
function printCard() {
  const printContent = `
    <div style="text-align: center;">
      <h2>Kartu Parkir Kampus</h2>
      <p><strong>Nama:</strong> ${outputNama.textContent}</p>
      <p><strong>NPM:</strong> ${outputNPM.textContent}</p>
      <p><strong>Program Studi:</strong> ${outputProdi.textContent}</p>
      <p><strong>Tahun Ajaran:</strong> ${outputTahun.textContent}</p>
      <p><strong>Nomor Telepon:</strong> ${outputTelepon.textContent}</p>
      <p><strong>Plat Nomor:</strong> ${outputPlat.textContent}</p>
      <p><strong>Jenis Kendaraan:</strong> ${outputJenis.textContent}</p>
      <p>${cardNote.textContent}</p>
    </div>
  `;
  
  
  const newWindow = window.open('', '', 'height=600,width=800');
  newWindow.document.write('<html><head><title>Cetak Kartu Parkir</title>');
  newWindow.document.write('<link rel="stylesheet" href="styles.css" />'); // Include your CSS for styling
  newWindow.document.write('</head><body>');
  newWindow.document.write(printContent);
  newWindow.document.write('</body></html>');
  newWindow.document.close();
  newWindow.print();
}

// Print damaged card function
function printCardRusak() {
  window.print();
}

// Display data in table for admin
function displayTable() {
  if (!currentUser  || akun[currentUser ].role !== "admin") {
    tableContainer.classList.add('hidden');
    return;
  }

  dataTable.innerHTML = "";
  dataKartu.forEach((item, index) => {
    const row = dataTable.insertRow();
    row.insertCell(0).textContent = item.tanggal;
    row.insertCell(1).textContent = item.nama;
    row.insertCell(2).textContent = item.npm;
    row.insertCell(3).textContent = item.prodi;
    row.insertCell(4).textContent = item.tahun;
    row.insertCell(5).textContent = item.telepon;
    row.insertCell(6).textContent = item.plat;
    row.insertCell(7).textContent = item.jenis;
    row.insertCell(8).textContent = item.diambil ? "Sudah Diambil" : "Belum Diambil";

    const aksiCell = row.insertCell(9);
    aksiCell.style.textAlign = "center";

    const lihatBtn = document.createElement("button");
    lihatBtn.textContent = "Lihat Info";
    lihatBtn.className = "aksi-button lihat-btn";
    lihatBtn.onclick = () => {
      alert(
        `Pengguna: ${item.nama}\n` +
        `NPM: ${item.npm}\n` +
        `Program Studi: ${item.prodi}\n` +
        `Tahun Ajaran: ${item.tahun}\n` +
        `Telepon: ${item.telepon}\n` +
        `Plat: ${item.plat}\n` +
        `Jenis: ${item.jenis}\n` +
        `Tanggal: ${item.tanggal}\n` +
        `Status: ${item.diambil ? "Sudah Diambil" : "Belum Diambil"}\n` +
        `${item.rusak ? "\nNote: Pengambilan kartu rusak/hilang dikenakan biaya Rp. 50.000" : ""}`
      );
    };
    aksiCell.appendChild(lihatBtn);

    const hapusBtn = document.createElement("button");
    hapusBtn.textContent = "Hapus";
    hapusBtn.className = "aksi-button hapus-btn";
    hapusBtn.onclick = () => {
      if (confirm("Yakin ingin menghapus data ini?")) {
        dataKartu.splice(index, 1);
        localStorage.setItem("dataKartu", JSON.stringify(dataKartu));
        displayTable();
      }
    };
    aksiCell.appendChild(hapusBtn);

    const ambilBtn = document.createElement("button");
    ambilBtn.textContent = item.diambil ? "Sudah Diambil" : "Tandai Sudah Diambil";
    ambilBtn.className = "aksi-button ambil-btn";
    if (item.diambil) {
      ambilBtn.disabled = true;
      ambilBtn.classList.add("disabled-btn");
    } else {
      ambilBtn.onclick = () => {
        item.diambil = true;
        localStorage.setItem("dataKartu", JSON.stringify(dataKartu));
        displayTable();
      };
    }
    aksiCell.appendChild(ambilBtn);
  });
}

// Reset print buttons
function resetPrintButtons() {
  document.getElementById("printCardBtn").disabled = true;
  cardContainer.classList.add('hidden');
}