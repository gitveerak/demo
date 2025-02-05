from flask import Flask,render_template
import os

app=Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

if __name__== '__main__':
    port = int(os.environ.get('PORT', 5000))  # Get the port from the environment variable or default to 5000
    app.run(host='0.0.0.0', port=port)