from flask import Flask, request, jsonify, render_template
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask App
app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks_ref = db.collection('tasks')
    tasks = tasks_ref.stream()
    task_list = [{**task.to_dict(), 'id': task.id} for task in tasks]
    return jsonify(task_list)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task_ref = db.collection('tasks').add({
        'name': data['name'],
        'completed': False
    })
    return jsonify({'success': True}), 201

@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    task_ref = db.collection('tasks').document(task_id)
    task_ref.update({
        'completed': data['completed']
    })
    return jsonify({'success': True})

@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task_ref = db.collection('tasks').document(task_id)
    task_ref.delete()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)