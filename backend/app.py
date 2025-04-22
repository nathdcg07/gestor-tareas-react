import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request
from flask_cors import CORS

# Conectar a Firebase
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Obtener tareas desde Firestore
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks_ref = db.collection("tasks")  # La colección en Firestore
    docs = tasks_ref.stream()
    tasks = [{"id": doc.id, **doc.to_dict()} for doc in docs]  # Convertir a JSON
    return jsonify(tasks)

# Agregar una nueva tarea a Firestore
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Falta el nombre de la tarea"}), 400
    
    new_task_ref = db.collection("tasks").add({"name": data["name"]})
    return jsonify({"id": new_task_ref[1].id, "name": data["name"]}), 201

#modifica alguna tarea
@app.route("/api/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):
    try:
        data = request.get_json()
        update_data = {}

        if "name" in data:
            update_data["name"] = data["name"]
        if "completed" in data:
            update_data["completed"] = data["completed"]

        if update_data:
            db.collection("tasks").document(task_id).update(update_data)
            return jsonify({"msg": "Tarea actualizada con éxito"}), 200
        else:
            return jsonify({"error": "No se enviaron datos válidos"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        print(f"Solicitud para eliminar tarea con ID: {task_id}")  
        db.collection("tasks").document(task_id).delete()
        return jsonify({"message": "Tarea eliminada correctamente"}), 200
    except Exception as e:
        print(f"Error eliminando tarea: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
