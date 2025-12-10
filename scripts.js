

// FUNZIONE PER GESTIRE IL FUNZIONAMENTO DELLA BARRA ORIZZONTALE
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".navbar-scroll a");
  const sections = document.querySelectorAll(".section");

  function hideAllSections() {
    sections.forEach((section) => {
      section.style.display = "none";
    });
  }

  // Funzione per rimuovere la classe 'active' da tutti i link
  function removeActiveClass() {
    links.forEach((link) => {
      link.classList.remove("active");
    });
  }

  // Funzione per centrare il link attivo nella visuale

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        hideAllSections();
        targetElement.style.display = "block";
        // targetElement.scrollIntoView({ behavior: "smooth" });

        // Rimuovi la classe 'active' da tutti i link e aggiungila al link cliccato
        removeActiveClass();
        this.classList.add("active");
      }
    });
  });

  ///Mostra la prima sezione per impostazione predefinita e evidenzia il primo link
  if (sections.length > 0 && links.length > 0) {
    sections[0].style.display = "block"; // Mostra la prima sezione
    links[0].classList.add("active"); // Aggiungi la classe 'active' al primo link
  }
});




// FUNZIONE PER per creare la tabella dei piloti da un foglio google
// 1. URL PUBBLICATO DEL FOGLIO GOOGLE (deve finire con &output=csv)
const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0hWQI6bqzVdr38OpcUlsNHcvuXnjzqdte1skzC8A9KAUFExFzXWqA7MCLbFiL0k1Gw1GMHBAJghCn/pub?gid=0&single=true&output=csv";
const tbody = document.getElementById("piloti-body");
const tfoot = document.getElementById("piloti-footer");
// Funzione principale per caricare e visualizzare i dati
async function LoadPiloti() {
  try {
    tbody.innerHTML = "";
    tfoot.innerHTML = "";

    const response = await fetch(SPREADSHEET_URL);
    const csvText = await response.text();

    // Analizza il CSV e lo trasforma in array di righe
    const rows = csvText
      .trim()
      .split("\n")
      .map((row) =>
        row.split(",").map((cell) => cell.trim().replace(/"/g, ""))
      );

    const header = rows[0];
    const dataRows = rows.slice(1);

    const COL_PILOTI = 0;
    const COL_NUMERO = 1;
    const COL_INFO = 2;

    // Le altre righe sono le normali voci
    // const itemRows = dataRows.slice(0, -1);

    // Crea le righe del corpo tabella
    for (const rowData of dataRows) {
      if (!rowData[COL_PILOTI]) continue;

      const piloti = rowData[COL_PILOTI];
      const numero = rowData[COL_NUMERO];
      const info = rowData[COL_INFO];

      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td data-label="Piloti">${piloti}</td>
                <td data-label="Num.">${numero}</td>
                <td data-label="Info">${info}</td>
            `;
      tbody.appendChild(tr);
    }


  } catch (error) {
    console.error("Errore nel caricamento dei piloti:", error);
    tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red; padding: 20px;">
                    ❌ Errore nel caricamento dei dati. Controlla la connessione o l'URL del foglio.
                </td>
            </tr>
        `;
  }
}
// Avvia il caricamento quando la pagina è pronta
document.addEventListener("DOMContentLoaded", LoadPiloti);



// FUNZIONE PER per creare la tabella degli admin da un foglio google
// 1. URL PUBBLICATO DEL FOGLIO GOOGLE (deve finire con &output=csv)
const SPREADSHEET_URL_ADMIN =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRx7dbRJV9vs3dkCo3zycLGxybjzItCLU6NizJLgzdlJXhgErb_HBugUN7wmeEYmilVVUS6nzmoHbhP/pub?gid=1215200164&single=true&output=csv";
const tbodyadmin = document.getElementById("admin-body");
const tfootadmin = document.getElementById("admin-footer");
// Funzione principale per caricare e visualizzare i dati
async function LoadAdmin() {
  try {
    tbodyadmin.innerHTML = "";
    tfootadmin.innerHTML = "";

    const response = await fetch(SPREADSHEET_URL_ADMIN);
    const csvText = await response.text();

    // Analizza il CSV e lo trasforma in array di righe
    const rows = csvText
      .trim()
      .split("\n")
      .map((row) =>
        row.split(",").map((cell) => cell.trim().replace(/"/g, ""))
      );

    const header = rows[0];
    const dataRows = rows.slice(1);

    const COL_RUOLO = 0;
    const COL_ADMIN = 1;

    // Le altre righe sono le normali voci
    // const itemRows = dataRows.slice(0, -1);

    // Crea le righe del corpo tabella
    for (const rowData of dataRows) {
      if (!rowData[COL_ADMIN]) continue;

      const ruolo = rowData[COL_RUOLO];
      const admin = rowData[COL_ADMIN];


      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td data-label="Ruolo">${ruolo}</td>
                <td data-label="Admin">${admin}</td>

            `;
      tbodyadmin.appendChild(tr);
    }

    // Mostra la riga del totale (ultima riga del CSV)
  } catch (error) {
    console.error("Errore nel caricamento degli admin:", error);
    tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red; padding: 20px;">
                    ❌ Errore nel caricamento dei dati. Controlla la connessione o l'URL del foglio.
                </td>
            </tr>
        `;
  }
}
// Avvia il caricamento quando la pagina è pronta
document.addEventListener("DOMContentLoaded", LoadAdmin);



// FUNZIONE ORMAI INUTILIZZATA (la lascio solo perchè non sono sicuro al 100% che sia totalmente inutlizzata), serviva a far scorrere la barra in alto con le sezioni home piloti admin eccetera
document.addEventListener("DOMContentLoaded", function () {
  const menu = document.querySelector(".navbar-scroll");

  menu.addEventListener("click", function (e) {
    if (e.target.classList.contains("menu-link")) {
      const clickedItem = e.target;
      const itemRect = clickedItem.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const menuContainer = document.querySelector(".navbar-container");
      const containerRect = menuContainer.getBoundingClientRect();

      // Calcolo delle posizioni
      const scrollLeft = menuContainer.scrollLeft;
      const containerCenter = containerRect.width / 2;
      const itemCenter =
        itemRect.left + itemRect.width / 2 - containerRect.left;

      // Nuova posizione di scroll
      const scrollTo = scrollLeft + (itemCenter - containerCenter);

      // Scroll dell'elemento nel menu
      menuContainer.scroll({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  });
});



