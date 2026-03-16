from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import get_response, clear_messages

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message")
    response = get_response(user_input)
    return jsonify({"response": response})

@app.route("/clear", methods=["POST"])
def clear_chat():
    clear_messages()
    return jsonify({"response": "Chat history cleared."})

if __name__ == "__main__":
    app.run(debug=True, port=8080)