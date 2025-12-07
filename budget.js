// 1. URL PUBBLICATO DEL FOGLIO GOOGLE (deve finire con &output=csv)
const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0hWQI6bqzVdr38OpcUlsNHcvuXnjzqdte1skzC8A9KAUFExFzXWqA7MCLbFiL0k1Gw1GMHBAJghCn/pub?gid=0&single=true&output=csv";

const tbody = document.getElementById("budget-body");
const tfoot = document.getElementById("budget-footer");

// Funzione principale per caricare e visualizzare i dati
async function loadBudget() {
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

    const COL_VOCE = 0;
    const COL_SPESA_EUR = 1;
    const COL_A_TESTA = 2;

    // Le altre righe sono le normali voci
    const itemRows = dataRows.slice(0, -1);

    // Crea le righe del corpo tabella
    for (const rowData of itemRows) {
      if (!rowData[COL_VOCE]) continue;

      const voce = rowData[COL_VOCE];
      const spesaEuro = rowData[COL_SPESA_EUR];
      const spesaATesta = rowData[COL_A_TESTA];


      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td data-label="Voce">${voce}</td>
                <td data-label="Spesa">${spesaEuro}</td>
                <td data-label="A Testa">${spesaATesta}</td>
            `;
      tbody.appendChild(tr);
    }

    // Mostra la riga del totale (ultima riga del CSV)

  } catch (error) {
    console.error("Errore nel caricamento del budget:", error);
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
document.addEventListener("DOMContentLoaded", loadBudget);
