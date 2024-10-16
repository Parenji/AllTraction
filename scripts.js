document.addEventListener("DOMContentLoaded", function () {
  const classifiche = [
    "backend/classifica/classifica1.json",
    "backend/classifica/classifica2.json",
    // "backend/classifica/classifica3.json",
    // "backend/classifica/classifica4.json",
    // "backend/classifica/classifica5.json",
  ];

  let top14 = [];

  // Carica la classifica generale e identifica i primi 14 classificati
  fetch(`${classifiche[1]}?t=${new Date().getTime()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Errore nel caricamento della classifica generale: " +
            response.statusText
        );
      }
      return response.json();
    })
    .then((data) => {
      // Identifica i primi 14 classificati
      top14 = data.slice(0, 14).map((item) => item.id_psn);
      // Ora carica le altre classifiche
      caricaClassifiche();
    })
    .catch((error) => {
      console.error("Errore nel caricamento della classifica generale:", error);
    });

  function caricaClassifiche() {
    classifiche.forEach((classifica, index) => {
      // if (index < 4) {
      const timestamp = new Date().getTime(); // Ottieni il timestamp corrente
      const urlWithTimestamp = `${classifica}?_=${timestamp}`; // Aggiungi il timestamp alla URL

      fetch(urlWithTimestamp)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Errore nel caricamento della classifica: " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          let container = document.getElementById(`classifica${index + 1}`);
          let html = "";

          // Genera la sezione "Lobby" per gli indici da 1 a 4
          // if (index < 4) {
          //   html += `<h2>Lobby ${index + 1}</h2>`;
          // } else {
          //   // Genera la sezione "Classifica Generale" per l'indice 5
          //   html += `<h2>Classifica Generale</h2>`;
          // }

          // Genera la tabella
          html += `<div class="table-container1"><table id="table${
            index + 1
          }"><thead><tr>
                            <th>Pos.</th>
                            <th>Naz.</th>
                            <th>Num.</th>
                            <th>ID GT7</th>
                            <th class="totalone">Totale</th>
                            <th class="totale hidden">L. Maggiore</th>
                            <th class="totale hidden">Deep Forest</th>
                            <th class="totale hidden">Sardegna</th>
                            <th class="totale hidden">Red Bull</th>
                            <th class="totale hidden">Monza</th>
                        </tr></thead><tbody>`;

          data.forEach((item, i) => {
            let rowClass = i % 2 === 0 ? "even-row" : "odd-row";
            // if (top14.includes(item.id_psn)) {
            //   rowClass += " qualified";
            // }
            html += `<tr class="${rowClass}">
                                <td>${item.posizione || ""}</td>
                                <td>
                                  <img class="table-img" src="images/${item.naz || "default"}.png" alt="${
                                              item.naz || "default"
                                            }" width="50" height="50">
                                </td>
                                <td>${item.n || ""}</td>

                                <td>${item.id_gt7 || ""}</td>
                                <td class="totalone">${item.totale || ""}</td>
                                <td class="totale hidden">${
                                  item.tot1 || ""
                                }</td>
                                <td class="totale hidden">${
                                  item.tot2 || ""
                                }</td>
                                <td class="totale hidden">${
                                  item.tot3 || ""
                                }</td>
                                <td class="totale hidden">${
                                  item.tot4 || ""
                                }</td>
                                <td class="totale hidden">${
                                  item.tot5 || ""
                                }</td>
                            </tr>`;
          });

          html += `</tbody></table></div>`; // Chiudi il contenitore scrollabile
          // Genera il pulsante per nascondere/mostrare le colonne
          html += `<button id="toggleColumnsButton${
            index + 1
          }" class="toggleColumnsButton">Mostra punteggi dettagliati</button>`;
          html += `<div style="margin-bottom: 5px;"></div>`;
          container.innerHTML = html;

          // Aggiungi l'evento click al pulsante per nascondere/mostrare le colonne
          const toggleColumnsButton = document.getElementById(
            `toggleColumnsButton${index + 1}`
          );
          toggleColumnsButton.addEventListener("click", function () {
            const table = document.getElementById(`table${index + 1}`);
            const columnsToToggle = table.querySelectorAll(".totale");
            columnsToToggle.forEach((column) => {
              column.classList.toggle("hidden");
            });
            // Verifica lo stato di una colonna specifica per determinare il testo del pulsante
            const isHidden = table.querySelector(".totale.hidden");
            const buttonText = isHidden
              ? "Mostra punteggi dettagliati"
              : "Nascondi punteggi dettagliati";
            toggleColumnsButton.textContent = buttonText;
          });
        })
        .catch((error) => {
          console.error("Errore nel caricamento della classifica:", error);
          let container = document.getElementById(`classifica${index + 1}`);
          container.innerHTML = `<p>Errore nel caricamento della classifica.</p>`;
        });
      // } else if (index === 4) {
      //   // La classifica generale è già stata caricata, quindi la saltiamo
      // }
    });
    // Aggiungi l'evento click per le sezioni delle tendine
    const accordions = document.querySelectorAll(".accordion");
    accordions.forEach((accordion) => {
      accordion.addEventListener("click", function () {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  function initializeCountdown(id, endtime) {
    const timerElement = document.getElementById(id);
    function updateCountdown() {
      const now = new Date().getTime();
      const timeleft = endtime - now;

      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

      timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      if (timeleft < 0) {
        clearInterval(countdowninterval);
        timerElement.innerHTML = "";
      }
    }

    const countdowninterval = setInterval(updateCountdown, 1000);
  }

  // const lobby1EndTime = new Date("Jul 9, 2024 21:00:00").getTime();
  // const lobby2EndTime = new Date("Jul 9, 2024 22:10:00").getTime();
  // const lobby3EndTime = new Date("Jul 11, 2024 21:00:00").getTime();
  // const lobby4EndTime = new Date("Jul 11, 2024 22:10:00").getTime();
  // const finaleEndTime = new Date("Jul 18, 2024 21:00:00").getTime();

  // initializeCountdown("timer1", lobby1EndTime);
  // initializeCountdown("timer2", lobby2EndTime);
  // initializeCountdown("timer3", lobby3EndTime);
  // initializeCountdown("timer4", lobby4EndTime);
  // initializeCountdown("timer5", finaleEndTime);
});

document.addEventListener("DOMContentLoaded", function () {
  const lobbys = ["backend/lobby/lobby1.json", "backend/lobby/lobby2.json"];

  caricaLobbys();

  function caricaLobbys() {
    lobbys.forEach((lobby, index) => {
      // if (index < 4) {
      const timestamp = new Date().getTime(); // Ottieni il timestamp corrente
      const urlWithTimestamp = `${lobby}?_=${timestamp}`; // Aggiungi il timestamp alla URL

      const hosts = ["???", "???"];

      // const live = ["Twitch", "Twitch", "Youtube", "Twitch"];

      const ora = [
        "Giovedì 17 ottobre 2024, ore 20:45",
        "Giovedì 17 ottobre 2024, ore 21:45",
      ];

      fetch(urlWithTimestamp)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Errore nel caricamento della lobby: " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          let container = document.getElementById(`lobby${index + 1}`);
          let html = "";

          // Genera la sezione "Lobby" per gli indici da 1 a 4
          // if (index < 2) {
          // html += `<h2>Lobby ${index + 1}</h2>`;
          // } else {
          // Genera la sezione "lobby Generale" per l'indice 5
          // html += `<h2>lobby Generale</h2>`;
          // }

          // Genera la tabella
          html += `<div class="table-container1">
          <div style="text-align: center;">${ora[index]}</div>  
          <div style="text-align: center;">Host: ${hosts[index]}</div>
       
          <table id="mable${index + 1}"><thead><tr>
                            <th>Naz.</th>
                            <th>Num.</th>
                            <th>ID PSN</th>
                            <th>ID GT7</th>
                          

                        </tr></thead><tbody>`;

          data.forEach((item, i) => {
            let rowClass = i % 2 === 0 ? "even-row" : "odd-row";
            html += `<tr class="${rowClass}">
                                <td>
                                  <img class="table-img" src="images/${item.naz || "default"}.png" alt="${
                                              item.naz || "default"
                                            }" width="50" height="50">
                                </td>
                                <td>${item.n || ""}</td>
                                <td>${item.id_psn || ""}</td>
                                <td>${item.id_gt7 || ""}</td>                           

                            </tr>`;
          });

          html += `</tbody></table></div>`; // Chiudi il contenitore scrollabile
          html += `<div style="margin-bottom: 5px;"></div>`;
          container.innerHTML = html;
        })
        .catch((error) => {
          console.error("Errore nel caricamento della lobby:", error);
          let container = document.getElementById(`lobby${index + 1}`);
          container.innerHTML = `<p>Errore nel caricamento della lobby.</p>`;
        });
    });
    // Aggiungi l'evento click per le sezioni delle tendine
    const accordions = document.querySelectorAll(".accordionn");
    accordions.forEach((accordion) => {
      accordion.addEventListener("click", function () {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    });
  }
});

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
        targetElement.scrollIntoView({ behavior: "smooth" });

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

async function loadJSON() {
  try {
    const response = await fetch("backend/penalita/penalita.json");
    const data = await response.json();
    populateTable(data);
  } catch (error) {
    console.error("Errore nel caricamento del file JSON:", error);
  }
}

// Funzione per popolare la tabella con i dati JSON
function populateTable(data) {
  const tableBody = document
    .getElementById("penaltiesTable")
    .getElementsByTagName("tbody")[0];
  data.forEach((item) => {
    const row = tableBody.insertRow();
    Object.values(item).forEach((text) => {
      const cell = row.insertCell();
      cell.textContent = text;
    });
  });
}

// Carica i dati JSON quando la pagina è caricata
window.onload = loadJSON;

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

// document.addEventListener("DOMContentLoaded", () => {
//   // Recupera i top 14 dalla classifica generale e crea la griglia di partenza
//   fetch("backend/classifica/classifica5.json")
//     .then((response) => response.json())
//     .then((data) => {
//       const top14 = data.slice(0, 14);
//       const gridContainer = document.querySelector(".grid-container");

//       top14.forEach((item, index) => {
//         const gridItemContainer = document.createElement("div");
//         gridItemContainer.classList.add("grid-item-container");

//         const gridIndex = document.createElement("div");
//         gridIndex.classList.add("grid-index");
//         gridIndex.textContent = `${index + 1}`;

//         const gridItem = document.createElement("div");
//         gridItem.classList.add("grid-item");
//         // Crea il contenitore gridItem come prima
//         // const gridItem = document.createElement('div');

//         // Crea il div per l'ID
//         const idDiv = document.createElement("div");
//         idDiv.textContent = item.id_gt7;
//         // Crea il div per l'immagine del team
//         const teamImgDiv = document.createElement("div");
//         const teamImg = document.createElement("img");
//         teamImg.src = `images/${item.team}.png`;
//         teamImg.alt = item.team;
//         teamImg.classList.add("team-icon"); // Aggiungi una classe all'immagine
//         teamImgDiv.appendChild(teamImg);

//         // Appendi i due div al gridItem
//         gridItem.appendChild(idDiv);
//         gridItem.appendChild(teamImgDiv);

//         // Appendi gridIndex e gridItem al container principale
//         gridItemContainer.appendChild(gridIndex); // Supponendo che gridIndex sia già definito
//         gridItemContainer.appendChild(gridItem);
//         gridContainer.appendChild(gridItemContainer);
//       });
//     })
//     .catch((error) =>
//       console.error("Errore nel caricamento della classifica generale:", error)
//     );
// });

// Data del prossimo evento
const nextEventDate = new Date("October 17, 2024 20:45:00").getTime();

// Funzione per il countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = nextEventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "In attesa dei risultati ufficiali...";
    }
}

// Aggiorna il countdown ogni secondo
setInterval(updateCountdown, 1000);