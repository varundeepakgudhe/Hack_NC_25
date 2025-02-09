from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Fixes CORS issues

@app.route('/api/message', methods=['GET'])
def get_message():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)