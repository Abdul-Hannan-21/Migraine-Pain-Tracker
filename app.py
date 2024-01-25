from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='client')
CORS(app)  

# In-memory storage for pain data
pain_data = []


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/add-pain', methods=['POST'])
def add_pain():
    pain_entry = request.json
    # Extracting pain level, disease, and date from the JSON request
    pain_level = pain_entry.get('painLevel')
    disease = pain_entry.get('disease')
    date = pain_entry.get('date')

    if pain_level is None or disease is None or date is None:
        return jsonify({'error': 'Missing fields in the request'}), 400

    # Adding pain entry to the pain data list
    pain_data.append({
        'painLevel': pain_level,
        'disease': disease,
        'date': date
    })

    return jsonify(pain_entry), 201

@app.route('/api/get-pain-data', methods=['GET'])
def get_pain_data():
    return jsonify({'painData': pain_data})

if __name__ == '__main__':
    app.run(debug=True, port=50002)
