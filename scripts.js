let ultimaGara = 7; // Cambia questo numero quando vuoi aggiornare la gara
document.getElementById("pen-ult-gara").innerText = `Penalità Gara ${ultimaGara}`;

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

/**
 * Carica i dati CSV da un URL di Foglio Google e li visualizza in una tabella HTML.
 *
 * @param {string} spreadsheetUrl L'URL pubblico del Foglio Google in formato CSV.
 * @param {string} tbodyId L'ID dell'elemento <tbody> dove inserire i dati.
 * @param {number[]} [columnIndices] Gli indici delle colonne (base 0) da visualizzare.
 * Se non specificato, vengono visualizzate TUTTE le colonne.
 */
async function loadAndCreateHtmlTable(spreadsheetUrl, tbodyId, columnIndices, maxRows = Infinity) {
  const tbody = document.getElementById(tbodyId);

  if (!tbody) {
    console.error(`Elemento <tbody> con ID "${tbodyId}" non trovato.`);
    return;
  }

  // Pulisci il contenitore prima di iniziare
  tbody.innerHTML = "";

  try {
    const response = await fetch(spreadsheetUrl);

    if (!response.ok) {
      throw new Error(
        `Errore HTTP: ${response.status} (${response.statusText})`
      );
    }

    const csvText = await response.text();

    // Funzione di parsing più robusta per CSV (anche se semplificata)
    const rows = csvText
      .trim()
      .split("\n")
      .map((row) =>
        // Suddivide le celle, gestendo le virgolette
        row
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((cell) => cell.trim().replace(/^"|"$/g, "").replace(/""/g, '"'))
      );

    if (!rows || rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="100%">Nessun dato trovato.</td></tr>`;
      return;
    }

    // La prima riga è l'intestazione
    const header = rows[0];
    // Le righe successive sono i dati
    const dataRows = rows.slice(1, 1 + maxRows);

    // 1. Definiamo quali colonne visualizzare
    let indicesToUse = columnIndices;
    if (!indicesToUse || indicesToUse.length === 0) {
      // Se non specificato, usiamo tutte le colonne disponibili nell'header
      indicesToUse = Array.from({ length: header.length }, (_, i) => i);
    }

    // 2. Creazione delle righe di dati (<tbody>)
    for (const rowData of dataRows) {
      // Se la prima cella della riga di dati è vuota, salta la riga
      if (rowData.length === 0 || !rowData[indicesToUse[0]]) continue;

      const tr = document.createElement("tr");
      let innerHTML = "";

      // 3. Iteriamo solo sugli indici di colonna che vogliamo visualizzare
      for (const colIndex of indicesToUse) {
        // Prende il valore della cella, o una stringa vuota se la cella non esiste
        const cellValue = rowData[colIndex] || "";
        // Prende il nome della colonna dall'header, o un nome generico
        const columnName = header[colIndex] || "";

        let cellContent = cellValue; // Contenuto di default è il testo

        // 🌟 NUOVA LOGICA PER LA GESTIONE DELLE IMMAGINI 🌟

        // Normalizziamo il valore della cella per creare il path del file
        const fileSlug = cellValue.toLowerCase().replace(/[^a-z0-9]+/g, "");

        if (columnName === "Circuito") {
          // Esempio: images/tracks/autopolis.png (o .svg)
          const imagePath = `images/tracks/${fileSlug}.png`;

          cellContent = `
                        <img 
                            src="${imagePath}" 
                            alt="${cellValue}" 
                            class="circuit-icon"
                            onerror="this.onerror=null; this.src='images/tracks/${fileSlug}.svg'; if(this.alt === 'images/tracks/${fileSlug}.svg') this.style.display='none'; this.alt='images/tracks/${fileSlug}.svg';"                        />
                    `;
        } else if (columnName === "Nazione" || columnName === "Country") {
          // Esempio: images/flags/jp.svg (o .png). Assumiamo bandiere in cartella "flags"
          const flagPath = `images/bandiere/${fileSlug}.svg`;

          cellContent = `
                        <img 
                            src="${flagPath}" 
                            alt="${cellValue}" 
                            class="nation-flag"
                            onerror="this.onerror=null; this.style.display='none';" 
                        />
                    `;
        }
        // Aggiungi la cella con il contenuto (testo o HTML dell'immagine)
        innerHTML += `<td data-label="${columnName}">${cellContent}</td>`;
      }

      tr.innerHTML = innerHTML;
      tbody.appendChild(tr);
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
    // Calcola colspan in base al numero di colonne che si dovevano usare
    const colspan = columnIndices ? columnIndices.length : 1;

    tbody.innerHTML = `
            <tr>
                <td colspan="${colspan}" style="text-align: center; color: red; padding: 20px;">
                    ❌ Errore nel caricamento dei dati.
                </td>
            </tr>
        `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Logica per index.html ---

  // Controlla se la pagina ha l'ID 'piloti-body' (il che indica che siamo in index.html)
  const pilotiBody = document.getElementById("piloti-body");

  if (pilotiBody) {
    console.log("Inizializzazione di index.html: Caricamento Piloti e Admin.");

    // --- Tabella Piloti ---
    const URL_PILOTI =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0hWQI6bqzVdr38OpcUlsNHcvuXnjzqdte1skzC8A9KAUFExFzXWqA7MCLbFiL0k1Gw1GMHBAJghCn/pub?gid=0&single=true&output=csv";
    loadAndCreateHtmlTable(URL_PILOTI, "piloti-body", [0, 1, 2]);

    // --- Tabella Admin ---
    const URL_ADMIN =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRx7dbRJV9vs3dkCo3zycLGxybjzItCLU6NizJLgzdlJXhgErb_HBugUN7wmeEYmilVVUS6nzmoHbhP/pub?gid=1215200164&single=true&output=csv";
    loadAndCreateHtmlTable(URL_ADMIN, "admin-body", [0, 1]);
  }

  // --- 2. Logica per gtec.html ---

  // Controlla se la pagina ha l'ID 'gtec' (il che indica che siamo in gtec.html)
  const gtec = document.getElementById("gtec");

  if (gtec) {
    console.log("Inizializzazione di gtec.html: Caricamento...");

    // --- Tabella Lobby ---
    const URL_LOBBY =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=0&single=true&output=csv";
    loadAndCreateHtmlTable(
      URL_LOBBY,
      "lobby-body"
      // [0, 1,] - (Usare l'array vuoto o `null` se si vogliono tutte le colonne,
      // altrimenti specificare quelle che vuoi mostrare)
    );
    // --- Tabella Lobby Promo e retro ---
    const URL_PROMRETR =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=1228545593&single=true&output=csv";
    loadAndCreateHtmlTable(
      URL_PROMRETR,
      "proret-body"
      // [0, 1,] - (Usare l'array vuoto o `null` se si vogliono tutte le colonne,
      // altrimenti specificare quelle che vuoi mostrare)
    );
    // --- Tabella classifica ---
    const URL_CLASS =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=126395538&single=true&output=csv";
    loadAndCreateHtmlTable(
      URL_CLASS,
      "classifica-body"
      // [0, 1,] - (Usare l'array vuoto o `null` se si vogliono tutte le colonne,
      // altrimenti specificare quelle che vuoi mostrare)
    );
        loadAndCreateHtmlTable(
      URL_CLASS,
      "classifica-short-body",
      [],
      10

    //   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      // altrimenti specificare quelle che vuoi mostrare)
    );
    // Penalità
   const URL_PEN =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=1753268594&single=true&output=csv";
        loadAndCreateHtmlTable(
      URL_PEN,
      "penalita-body",

    //   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      // altrimenti specificare quelle che vuoi mostrare)
    );


        const URL_CALENDAR =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=912348639&single=true&output=csv";
    loadAndCreateHtmlTable(
      URL_CALENDAR,
      "calendar-body",
      [0, 2, 1, 4] //(Usare l'array vuoto o `null` se si vogliono tutte le colonne,
      // altrimenti specificare quelle che vuoi mostrare)
    );
  }
  // --- 3. Logica per interno.html ---

  // Controlla se la pagina ha l'ID 'gtec' (il che indica che siamo in gtec.html)
  const interno = document.getElementById("interno");

  if (interno) {
    console.log("Inizializzazione di gtec.html: Caricamento...");

    // --- Tabella calendar ---
    const URL_CALENDAR =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjIK9QJjiVNA9MC4opAz426vl9zzl7X6A3OS0P7h8yikDIXoK5tVetXnrQAYYew0Gz7wEMtM2ZtRkl/pub?gid=0&single=true&output=csv";
    loadAndCreateHtmlTable(
      URL_CALENDAR,
      "calendar-body",
      [0, 2, 1, 4] //(Usare l'array vuoto o `null` se si vogliono tutte le colonne,
      // altrimenti specificare quelle che vuoi mostrare)
    );
  }
});
