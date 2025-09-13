# backend/server.py
from flask import Flask, jsonify, request
from flask_cors import CORS

print(">>> Running server.py...")

app = Flask(__name__)
CORS(app)

# In-memory "database"
tasks = []

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.json
    new_task = {
        "id": len(tasks) + 1,
        "title": data.get("title"),
        "deadline": data.get("deadline"),
        "progress": 0
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

if __name__ == "__main__":
    print("✅ Backend running at http://localhost:5000")
    app.run(debug=True)