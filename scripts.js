// questo js ha tutte le funzioni che servono al sito tranne quella che genera la tabella piloti tramite google sheets



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
    const itemRows = dataRows.slice(0, -1);

    // Crea le righe del corpo tabella
    for (const rowData of itemRows) {
      if (!rowData[COL_PILOTI]) continue;

      const piloti = rowData[COL_PILOTI];
      const numero = rowData[COL_NUMERO];
      const info = rowData[COL_INFO];

      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td data-label="Piloti">${piloti}</td>
                <td data-label="Numero">${numero}</td>
                <td data-label="Info">${info}</td>
            `;
      tbody.appendChild(tr);
    }

    // Mostra la riga del totale (ultima riga del CSV)
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





// FUNZIONE ORMAI INUTILIZZATA, serviva a far scorrere la barra in alto con le sezioni home piloti admin eccetera
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




// FUNZIONE PER UN EVENTUALE COUNTDOWN PER UNA GARA, AL MOMENTO INUTILIZZATA MA PER ORA LA LASCIO QUI

// Data del prossimo evento
const nextEventDate = new Date("April 24, 2025 21:30:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = nextEventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let countdownHTML = "";

  // if (days > 0) {
  countdownHTML += `<div class='time-box'><div>${days}</div><span>GIORNI</span></div>`;
  // }
  countdownHTML += `<div class='time-box'><div>${hours}</div><span>ORE</span></div>`;
  countdownHTML += `<div class='time-box'><div>${minutes}</div><span>MINUTI</span></div>`;
  // if (days === 0) {
  countdownHTML += `<div class='time-box'><div>${seconds}</div><span>SECONDI</span></div>`;
  // }

  document.getElementById("countdown").innerHTML = countdownHTML;

  if (distance < 0) {
    document.getElementById("countdown").innerHTML =
      "In attesa dei risultati ufficiali...";
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();
// Aggiorna il countdown ogni secondo
setInterval(updateCountdown, 1000);
