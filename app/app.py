from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import get_response

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message")
    response = get_response(user_input)
    return jsonify({"response": response})