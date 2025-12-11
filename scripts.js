

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
async function loadAndCreateHtmlTable(spreadsheetUrl, tbodyId, columnIndices) {
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
            throw new Error(`Errore HTTP: ${response.status} (${response.statusText})`);
        }
        
        const csvText = await response.text();

        // Funzione di parsing più robusta per CSV (anche se semplificata)
        const rows = csvText
            .trim()
            .split("\n")
            .map((row) =>
                // Suddivide le celle, gestendo le virgolette
                row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                .map((cell) => cell.trim().replace(/^"|"$/g, "").replace(/""/g, '"'))
            );

        if (!rows || rows.length === 0) {
            tbody.innerHTML = `<tr><td colspan="100%">Nessun dato trovato.</td></tr>`;
            return;
        }
        
        // La prima riga è l'intestazione
        const header = rows[0];
        // Le righe successive sono i dati
        const dataRows = rows.slice(1);
        
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
            let innerHTML = '';

            // 3. Iteriamo solo sugli indici di colonna che vogliamo visualizzare
            for (const colIndex of indicesToUse) {
                // Prende il valore della cella, o una stringa vuota se la cella non esiste
                const cellValue = rowData[colIndex] || '';
                // Prende il nome della colonna dall'header, o un nome generico
                const columnName = header[colIndex] || '';
                
                innerHTML += `<td data-label="${columnName}">${cellValue}</td>`;
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
    const pilotiBody = document.getElementById('piloti-body');

    if (pilotiBody) {
        console.log("Inizializzazione di index.html: Caricamento Piloti e Admin.");
        
        // --- Tabella Piloti ---
        const URL_PILOTI = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0hWQI6bqzVdr38OpcUlsNHcvuXnjzqdte1skzC8A9KAUFExFzXWqA7MCLbFiL0k1Gw1GMHBAJghCn/pub?gid=0&single=true&output=csv";
        loadAndCreateHtmlTable(
            URL_PILOTI, 
            'piloti-body', 
            [0, 1, 2] 
        );

        // --- Tabella Admin ---
        const URL_ADMIN =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRx7dbRJV9vs3dkCo3zycLGxybjzItCLU6NizJLgzdlJXhgErb_HBugUN7wmeEYmilVVUS6nzmoHbhP/pub?gid=1215200164&single=true&output=csv";
        loadAndCreateHtmlTable(
            URL_ADMIN, 
            'admin-body', 
            [0, 1] 
        );
    }


    // --- 2. Logica per campionato.html ---

    // Controlla se la pagina ha l'ID 'lobby-body' (il che indica che siamo in campionato.html)
    const lobbyBody = document.getElementById('lobby-body');

    if (lobbyBody) {
        console.log("Inizializzazione di campionato.html: Caricamento Lobby.");

        // --- Tabella Lobby ---
        const URL_LOBBY =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=0&single=true&output=csv";
        loadAndCreateHtmlTable(
            URL_LOBBY, 
            'lobby-body', 
            // [0, 1,] - (Usare l'array vuoto o `null` se si vogliono tutte le colonne, 
            // altrimenti specificare quelle che vuoi mostrare)
        );
        // --- Tabella Lobby Promo e retro ---
        const URL_PROMRETR =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=1228545593&single=true&output=csv";
        loadAndCreateHtmlTable(
            URL_PROMRETR, 
            'proret-body', 
            // [0, 1,] - (Usare l'array vuoto o `null` se si vogliono tutte le colonne, 
            // altrimenti specificare quelle che vuoi mostrare)
        );
        // --- Tabella classifica ---
        const URL_CLASS =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyncPYqAUjekbprRwnUdrOpqYvPDrsohSpmmwedX18L0cQxbiRca3YLfBdbqpg05zr9l92xpv1chrZ/pub?gid=126395538&single=true&output=csv";
        loadAndCreateHtmlTable(
            URL_CLASS, 
            'classifica-body', 
            // [0, 1,] - (Usare l'array vuoto o `null` se si vogliono tutte le colonne, 
            // altrimenti specificare quelle che vuoi mostrare)
        );
    }
});







