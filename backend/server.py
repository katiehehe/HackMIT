# backend/server.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

print(">>> Running server.py...")

app = Flask(__name__)
CORS(app)

# In-memory "database"
tasks = []

@app.route("/")
def index():
    return "Hello from Flask!"

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    #code to sort tasks chronologically
    sorted_tasks = sorted(tasks, 
                          key=lambda task: datetime.strptime(task["deadline"], "%Y-%m-%d"))
    return jsonify(sorted_tasks)

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.json
    new_task = {
        "id": len(tasks) + 1,
        "title": data.get("title"),
        "deadline": data.get("deadline"),
        "subtasks": data.get("subtasks", [])  # default to empty list
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    #deletes the tasks that are marked as complete
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"message": "Task deleted"}), 200

@app.route("/api/tasks/<int:task_id>/subtasks", methods=["PUT"])
def add_subtask(task_id):
    for task in tasks:
        if task["id"] == task_id:
            task["subtasks"].append("")
            return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404

if __name__ == "__main__":
    print(" Backend running at http://localhost:5000")
    app.run(debug=True)