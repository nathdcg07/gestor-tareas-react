from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {"id": 1, "name": "Hacer compritas"},
    {"id": 2, "name": "Practicar Python"},
    {"id": 3, "name": "Revisar emails"}
]

# Ruta para obtener las tareas
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# Para agregar nuevas tareas
@app.route('/api/tasks', methods=['POST'])
def add_task():
    print("Headers recibidos:", request.headers)
    print("Datos recibidos:", request.data)

    if request.content_type != "application/json":
        return jsonify({"error": "Content-Type debe ser application/json"}), 415

    try:
        data = request.get_json()
        print("JSON recibido:", data)

        if not data or "name" not in data:  # 👈 Este if debe estar dentro del try
            return jsonify({"error": "Falta el nombre de la tarea"}), 400

        new_task = {
            "id": len(tasks) + 1,
            "name": data["name"]
        }
        tasks.append(new_task)
        return jsonify(new_task), 201

    except Exception as e:
        return jsonify({"error": f"Error procesando JSON: {str(e)}"}), 400

if __name__ == '__main__':
    app.run(debug=True)
