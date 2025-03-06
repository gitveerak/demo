from flask import Flask,render_template,request,redirect,url_for,send_file,jsonify
from pymongo import MongoClient,DESCENDING
from datetime import datetime,timedelta
from bson import ObjectId
import os

app=Flask(__name__)

MONGO_URI="mongodb+srv://veerak:doggydon.@clouddb.gt9k6.mongodb.net/?retryWrites=true&w=majority&appName=clouddb"

client = MongoClient(MONGO_URI) 
db = client["demodb"]  
collection = db["users"] 

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/timer', methods=['GET', 'POST'])
def timer():
    if request.method == 'POST':
        name = request.form.get('name_input')
        time = request.form.get('time_input')

        data={'Name':name.title(),
                'Timing':time+' min',
                    "Created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "Stop_at": (datetime.now() + timedelta(minutes=int(time))).strftime("%Y-%m-%d %H:%M:%S"),
                            "Status":'⏳'}
        collection.insert_one(data)
        return redirect(url_for('timer'))  
    
    entries = list(collection.find())
    for entry in entries:
        entry["_id"] = str(entry["_id"]) 
    return render_template('reminder.html',entries=entries)

@app.route("/play-audio")
def play_audio():
    return send_file("static/audio/alert_notification.wav", mimetype="audio/wav")

@app.route("/updated_data", methods=["POST"])
def updated_data():
    latest_doc =collection.find_one({}, sort=[("_id", DESCENDING)])
    if latest_doc:
        collection.update_one({"_id": latest_doc["_id"]},{"$set": {"Status":"✅"}})
        return jsonify({"status": "✅", "_id": str(latest_doc["_id"])}) 
    return redirect(url_for('timer')) 

@app.route("/canceled_data", methods=["POST"])
def canceled_data():
    latest_doc =collection.find_one({}, sort=[("_id", DESCENDING)])
    if latest_doc:
        collection.update_one({"_id": latest_doc["_id"]},{"$set": {"Status":"❌"}})
        return jsonify({"status": "❌", "_id": str(latest_doc["_id"])}) 
    return redirect(url_for('timer')) 

@app.route("/delete/<doc_id>", methods=["DELETE"])
def delete_entry(doc_id):
    result = collection.delete_one({"_id": ObjectId(doc_id)})
    if result.deleted_count > 0:
        return jsonify({"success": True}), 200
    return jsonify({"error": "Document not found"}), 404


if __name__== '__main__':
    port = int(os.environ.get('PORT', 5000))  # Get the port from the environment variable or default to 5000
    app.run(host='0.0.0.0', port=port)