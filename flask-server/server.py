from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/dick", methods=['GET'])
def members():
    return {"man": ["poop", "fart", "dick"]}

if __name__ == "__main__":
    app.run(debug=True)
