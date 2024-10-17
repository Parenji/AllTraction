import subprocess
import pandas as pd
import sys
print(sys.executable)

# Lista degli script da eseguire
scripts = ['penalita/penalita.py', 'lobby/lobbypy.py', 'classifica/classifiche.py', 'risultati/classifiche.py']

def run_scripts():
    processes = []
    
    for script in scripts:
        # Esegui lo script in parallelo (puoi usare .run per sequenziale)
        process = subprocess.Popen(['python3', script], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        processes.append(process)
    
    # Attendere che tutti i processi terminino
    for process in processes:
        stdout, stderr = process.communicate()  # Attende che lo script termini
        if process.returncode == 0:
            print(f'{process.args[1]} eseguito con successo.')
            print(stdout.decode())  # Output dello script
        else:
            print(f'Errore nell\'esecuzione di {process.args[1]}.')
            print(stderr.decode())  # Mostra l'errore

if __name__ == '__main__':
    run_scripts()
