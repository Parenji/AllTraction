import pandas as pd

# Carica il file Excel
excel_file = 'lobbys.xlsx'

# Leggi tutti i fogli del file Excel
excel_data = pd.read_excel(excel_file, sheet_name=None)

# Salva ogni foglio come un file JSON
for sheet_name, data in excel_data.items():
    json_file = f'{sheet_name}.json'
    data.to_json(json_file, orient='records')
    print(f'Salvato {json_file}')
