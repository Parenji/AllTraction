document.addEventListener("DOMContentLoaded", function() {
    const classifiche = ['classifica1.json', 'classifica2.json', 'classifica3.json', 'classifica4.json', 'classifica5.json'];

    classifiche.forEach((classifica, index) => {
        fetch(classifica)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore nel caricamento della classifica: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                let container = document.getElementById(`classifica${index + 1}`);
                let html = '';
                
                
                // Genera la sezione "Lobby" per gli indici da 1 a 4
                if (index < 4) {
                    html += `<h2>Lobby ${index + 1}</h2>`;
                } else {
                    // Genera la sezione "Classifica Generale" per l'indice 5
                    html += `<h2>Classifica Generale</h2>`;
                }
                // Genera il pulsante per nascondere/mostrare le colonne
                html += `<button id="toggleColumnsButton${index + 1}" class="toggleColumnsButton">Mostra colonne dei punteggi dettagliati</button>`;
                html += `<div style="margin-bottom: 5px;"></div>`;
                // Genera la tabella
                html += `<table id="table${index + 1}"><thead><tr>
                            <th>Posizione</th>
                            <th>Pilota</th>
                            <th class="pole hidden">Pole WG</th>
                            <th class="gara hidden">Gara WG</th>
                            <th class="gv hidden">GV WG</th>
                            <th class="totale">TOT. Watkins Glen</th>
                            <th class="pole hidden">Pole ATL</th>
                            <th class="gara hidden">Gara ATL</th>
                            <th class="gv hidden">GV ATL</th>
                            <th class="totale">TOT. Road Atlanta</th>
                            <th class="pole hidden">Pole FUJ</th>
                            <th class="gara hidden">Gara FUJ</th>
                            <th class="gv hidden">GV FUJ</th>
                            <th class="totale">TOT. Fuji</th>
                            <th class="pole hidden">Pole AUT</th>
                            <th class="gara hidden">Gara AUT</th>
                            <th class="gv hidden">GV AUT</th>
                            <th class="totale">TOT. Autopolis</th>
                            <th class="pole hidden">Pole SPA</th>
                            <th class="gara hidden">Gara SPA</th>
                            <th class="gv hidden">GV SPA</th>
                            <th class="totale">TOT. SPA</th>
                            <th class="pole hidden">Pole RB</th>
                            <th class="gara hidden">Gara RB</th>
                            <th class="gv hidden">GV RB</th>
                            <th class="totale">TOT. Redbull</th>
                            <th class="totalone">TOTALE</th>
                        </tr></thead><tbody>`;
                
                data.forEach(item => {
                    html += `<tr>
                                <td>${item.posizione || ''}</td>
                                <td>${item.pilota || ''}</td>
                                <td class="pole hidden">${item.pole_wg || ''}</td>
                                <td class="gara hidden">${item.gara_wg || ''}</td>
                                <td class="gv hidden">${item.gv_wg || ''}</td>
                                <td class="totale">${item.tot_wg || ''}</td>
                                <td class="pole hidden">${item.pole_atl || ''}</td>
                                <td class="gara hidden">${item.gara_atl || ''}</td>
                                <td class="gv hidden">${item.gv_atl || ''}</td>
                                <td class="totale">${item.tot_atl || ''}</td>
                                <td class="pole hidden">${item.pole_fuj || ''}</td>
                                <td class="gara hidden">${item.gara_fuj || ''}</td>
                                <td class="gv hidden">${item.gv_fuj || ''}</td>
                                <td class="totale">${item.tot_fuj || ''}</td>
                                <td class="pole hidden">${item.pole_aut || ''}</td>
                                <td class="gara hidden">${item.gara_aut || ''}</td>
                                <td class="gv hidden">${item.gv_aut || ''}</td>
                                <td class="totale">${item.tot_aut || ''}</td>
                                <td class="pole hidden">${item.pole_spa || ''}</td>
                                <td class="gara hidden">${item.gara_spa || ''}</td>
                                <td class="gv hidden">${item.gv_spa || ''}</td>
                                <td class="totale">${item.tot_spa || ''}</td>
                                <td class="pole hidden">${item.pole_rb || ''}</td>
                                <td class="gara hidden">${item.gara_rb || ''}</td>
                                <td class="gv hidden">${item.gv_rb || ''}</td>
                                <td class="totale">${item.tot_rb || ''}</td>
                                <td class="totalone">${item.totale || ''}</td>
                            </tr>`;
                });

                html += `</tbody></table>`;
                container.innerHTML = html;

                // Aggiungi l'evento click al pulsante per nascondere/mostrare le colonne
                const toggleColumnsButton = document.getElementById(`toggleColumnsButton${index + 1}`);
                toggleColumnsButton.addEventListener('click', function() {
                    const table = document.getElementById(`table${index + 1}`);
                    const columnsToToggle = table.querySelectorAll('.pole, .gara, .gv');
                    columnsToToggle.forEach(column => {
                        column.classList.toggle('hidden');
                    });
                    // Modifica il testo del pulsante in base allo stato delle colonne
                    const buttonText = table.classList.contains('hidden') ? 'Mostra/Nascondi colonne' : 'Mostra/Nascondi colonne';
                    toggleColumnsButton.textContent = buttonText;
                });

            })
            .catch(error => {
                console.error('Errore nel caricamento della classifica:', error);
                let container = document.getElementById(`classifica${index + 1}`);
                container.innerHTML = `<p>Errore nel caricamento della classifica.</p>`;
            });
    });
});
