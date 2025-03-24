from flask import Flask,render_template,request,redirect,url_for,send_file,jsonify,session
from pymongo import MongoClient,DESCENDING
from datetime import datetime,timedelta
from bson import ObjectId
import os

# Load .env file only in development (not in Render, Heroku, etc.)

app=Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI) 
db = client["demodb"]  
collection = db["timer data"]
reg_data = db["reg_user"] 

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/login')           #   login form
def login():
    message=session.pop('message', None)
    report=session.pop('login_report', None)
    return render_template('login.html',message=message,report=report)

@app.route('/log', methods=['GET','POST'])         #   Login form
def log():
    name = request.form.get('username')
    password = request.form.get('password')

    user = reg_data.find_one({'Name': name, 'Password': password})

    if user:
        session['user'] = name 
        session['report']="Login successful!"
        return redirect(url_for('timer')) 
    else:
        session['login_report']="Invalid username or password"

    return redirect(url_for('login'))  

@app.route('/register')        #   register page
def register():
    return render_template('register.html')

@app.route('/reg', methods=['GET','POST'])         #   Register form
def reg():
    name = request.form.get('username')
    email = request.form.get('email')
    dob = request.form.get('dob')
    rpassword = request.form.get('repeat_password')

    data={'Name':name,
            'Email':email,
            'D.O.B':dob,
            'Password':rpassword,
                "Created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    }
    reg_data.insert_one(data)
    session['message']="Account Suceesfully Created"
    return redirect(url_for('login'))  


@app.route('/timer', methods=['GET', 'POST'])          #   Timer form
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

@app.route("/play-audio")          #   Audio source
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