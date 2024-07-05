document.addEventListener("DOMContentLoaded", function () {
  const classifiche = [
    "backend/classifica/classifica1.json",
    "backend/classifica/classifica2.json",
    "backend/classifica/classifica3.json",
    "backend/classifica/classifica4.json",
    "backend/classifica/classifica5.json",
  ];

  let top14 = [];

  // Carica la classifica generale e identifica i primi 14 classificati
  fetch(`${classifiche[4]}?t=${new Date().getTime()}`)
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
                            <th>ID PSN</th>
                            <th>ID GT7</th>
                            <th>Team</th>
                            <th class="totalone">Totale</th>
                            <th class="pole hidden">Pole WG</th>
                            <th class="gara hidden">Gara WG</th>
                            <th class="gv hidden">GV WG</th>
                            <th class="totale">W. Glen</th>
                            <th class="pole hidden">Pole ATL</th>
                            <th class="gara hidden">Gara ATL</th>
                            <th class="gv hidden">GV ATL</th>
                            <th class="totale">R. Atlanta</th>
                            <th class="pole hidden">Pole FUJ</th>
                            <th class="gara hidden">Gara FUJ</th>
                            <th class="gv hidden">GV FUJ</th>
                            <th class="totale">Fuji</th>
                            <th class="pole hidden">Pole AUT</th>
                            <th class="gara hidden">Gara AUT</th>
                            <th class="gv hidden">GV AUT</th>
                            <th class="totale">Autop.</th>
                            <th class="pole hidden">Pole Spa</th>
                            <th class="gara hidden">Gara Spa</th>
                            <th class="gv hidden">GV Spa</th>
                            <th class="totale">Spa</th>
                            <th class="pole hidden">Pole RB</th>
                            <th class="gara hidden">Gara RB</th>
                            <th class="gv hidden">GV RB</th>
                            <th class="totale">Red Bull</th>
                        </tr></thead><tbody>`;

          data.forEach((item, i) => {
            let rowClass = i % 2 === 0 ? "even-row" : "odd-row";
            if (top14.includes(item.id_psn)) {
              rowClass += " qualified";
            }
            html += `<tr class="${rowClass}">
                                <td>${item.posizione || ""}</td>
                                <td>${item.id_psn || ""}</td>
                                <td>${item.id_gt7 || ""}</td>
                                 <td>${item.team || ""}</td>
                                <td class="totalone">${item.totale || ""}</td>
                                <td class="pole hidden">${
                                  item.pole_wg || ""
                                }</td>
                                <td class="gara hidden">${
                                  item.gara_wg || ""
                                }</td>
                                <td class="gv hidden">${item.gv_wg || ""}</td>
                                <td class="totale">${item.tot_wg || ""}</td>
                                <td class="pole hidden">${
                                  item.pole_atl || ""
                                }</td>
                                <td class="gara hidden">${
                                  item.gara_atl || ""
                                }</td>
                                <td class="gv hidden">${item.gv_atl || ""}</td>
                                <td class="totale">${item.tot_atl || ""}</td>
                                <td class="pole hidden">${
                                  item.pole_fuj || ""
                                }</td>
                                <td class="gara hidden">${
                                  item.gara_fuj || ""
                                }</td>
                                <td class="gv hidden">${item.gv_fuj || ""}</td>
                                <td class="totale">${item.tot_fuj || ""}</td>
                                <td class="pole hidden">${
                                  item.pole_aut || ""
                                }</td>
                                <td class="gara hidden">${
                                  item.gara_aut || ""
                                }</td>
                                <td class="gv hidden">${item.gv_aut || ""}</td>
                                <td class="totale">${item.tot_aut || ""}</td>
                                <td class="pole hidden">${
                                  item.pole_spa || ""
                                }</td>
                                <td class="gara hidden">${
                                  item.gara_spa || ""
                                }</td>
                                <td class="gv hidden">${item.gv_spa || ""}</td>
                                <td class="totale">${item.tot_spa || ""}</td>
                                <td class="pole hidden">${
                                  item.pole_rb || ""
                                }</td>
                                <td class="gara hidden">${
                                  item.gara_rb || ""
                                }</td>
                                <td class="gv hidden">${item.gv_rb || ""}</td>
                                <td class="totale">${item.tot_rb || ""}</td>
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
            const columnsToToggle = table.querySelectorAll(".pole, .gara, .gv");
            columnsToToggle.forEach((column) => {
              column.classList.toggle("hidden");
            });
            // Verifica lo stato di una colonna specifica per determinare il testo del pulsante
            const isHidden = table.querySelector(".pole.hidden");
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

  const lobby1EndTime = new Date("Jul 9, 2024 21:00:00").getTime();
  const lobby2EndTime = new Date("Jul 9, 2024 22:10:00").getTime();
  const lobby3EndTime = new Date("Jul 11, 2024 21:00:00").getTime();
  const lobby4EndTime = new Date("Jul 11, 2024 22:10:00").getTime();

  initializeCountdown("timer1", lobby1EndTime);
  initializeCountdown("timer2", lobby2EndTime);
  initializeCountdown("timer3", lobby3EndTime);
  initializeCountdown("timer4", lobby4EndTime);
});

document.addEventListener("DOMContentLoaded", function () {
  const lobbys = ["backend/lobby/lobby1.json", "backend/lobby/lobby2.json", "backend/lobby/lobby3.json", "backend/lobby/lobby4.json"];

  caricaLobbys();

  function caricaLobbys() {
    lobbys.forEach((lobby, index) => {
      // if (index < 4) {
      const timestamp = new Date().getTime(); // Ottieni il timestamp corrente
      const urlWithTimestamp = `${lobby}?_=${timestamp}`; // Aggiungi il timestamp alla URL

      const hosts = ["Rupetheking", "BAD_Brucem84", "TLM_wid83", "BAD_Brucem84"];

      const live = ["Twitch", "Twitch", "Youtube", "Twitch"];

      const ora = [
        "Martedì 9 luglio, ore 21:00",
        "Martedì 9 luglio, ore 22:10",
        "Giovedì 11 luglio, ore 21:00",
        "Giovedì 11 luglio, ore 22:10",
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
          // if (index < 4) {
          //   html += `<h2>Lobby ${index + 1}</h2>`;
          // } else {
          //   // Genera la sezione "lobby Generale" per l'indice 5
          //   html += `<h2>lobby Generale</h2>`;
          // }

          // Genera la tabella
          html += `<div class="table-container1">
          <div style="text-align: center;">${ora[index]}</div>  
          <div style="text-align: center;">Host: ${hosts[index]}</div>
          <div style="text-align: center;">Live su: ${live[index]}</div>
       
          <table id="mable${index + 1}"><thead><tr>
                            <th>N.</th>
                            <th>ID PSN</th>
                            <th>ID GT7</th>
                            <th>Team</th>

                        </tr></thead><tbody>`;

          data.forEach((item, i) => {
            let rowClass = i % 2 === 0 ? "even-row" : "odd-row";
            html += `<tr class="${rowClass}">
                                <td>${item.n || ""}</td>
                                <td>${item.id_psn || ""}</td>
                                <td>${item.id_gt7 || ""}</td>
                                 <td>${item.team || ""}</td>
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
      // } else if (index === 4) {
      //   // La lobby generale è già stata caricata, quindi la saltiamo
      // }
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
      const response = await fetch('backend/penalita/penalita.json');
      const data = await response.json();
      populateTable(data);
  } catch (error) {
      console.error('Errore nel caricamento del file JSON:', error);
  }
}

// Funzione per popolare la tabella con i dati JSON
function populateTable(data) {
  const tableBody = document.getElementById('penaltiesTable').getElementsByTagName('tbody')[0];
  data.forEach(item => {
      const row = tableBody.insertRow();
      Object.values(item).forEach(text => {
          const cell = row.insertCell();
          cell.textContent = text;
      });
  });
}

// Carica i dati JSON quando la pagina è caricata
window.onload = loadJSON;


document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('.navbar-scroll');

  menu.addEventListener('click', function (e) {
      if (e.target.classList.contains('menu-link')) {
          const clickedItem = e.target;
          const itemRect = clickedItem.getBoundingClientRect();
          const menuRect = menu.getBoundingClientRect();
          const menuContainer = document.querySelector('.navbar-container');
          const containerRect = menuContainer.getBoundingClientRect();

          // Calcolo delle posizioni
          const scrollLeft = menuContainer.scrollLeft;
          const containerCenter = containerRect.width / 2;
          const itemCenter = itemRect.left + (itemRect.width / 2) - containerRect.left;

          // Nuova posizione di scroll
          const scrollTo = scrollLeft + (itemCenter - containerCenter);

          // Scroll dell'elemento nel menu
          menuContainer.scroll({
              left: scrollTo,
              behavior: 'smooth'
          });
      }
  });
});
