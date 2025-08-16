from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

data_kartu = []
akun = {
    "mahasiswa": {"password": "12345", "role": "user"},
    "admin": {"password": "admin", "role": "admin"}
}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/script.js')
def serve_script():
    return send_from_directory('.', 'script.js')

@app.route('/style.css')
def serve_css():
    return send_from_directory('.', 'style.css')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username in akun and akun[username]["password"] == password:
        return jsonify({"status": "success", "role": akun[username]["role"]})
    return jsonify({"status": "failed", "message": "Username atau password salah"}), 401

@app.route('/buat-kartu', methods=['POST'])
def buat_kartu():
    data = request.json
    data['tanggal'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data['status'] = "Belum Diambil"
    data_kartu.append(data)
    return jsonify({"status": "success", "message": "Kartu berhasil ditambahkan"})

@app.route('/data-kartu', methods=['GET'])
def data_kartu_all():
    return jsonify(data_kartu)

@app.route('/ambil-kartu', methods=['POST'])
def ambil_kartu():
    data = request.json
    npm = data.get("npm")
    for kartu in data_kartu:
        if kartu["npm"] == npm:
            kartu["status"] = "Sudah Diambil"
            return jsonify({"status": "success", "message": "Kartu sudah diambil"})
    return jsonify({"status": "failed", "message": "Data tidak ditemukan"}), 404

@app.route('/hapus-kartu', methods=['DELETE'])
def hapus_kartu():
    data = request.json
    npm = data.get("npm")
    global data_kartu
    data_kartu = [k for k in data_kartu if k["npm"] != npm]
    return jsonify({"status": "success", "message": "Kartu berhasil dihapus"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
