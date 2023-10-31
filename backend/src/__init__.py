from flask_login import LoginManager
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = "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"


CORS(app, origins=["http://localhost:3000"])

import src.views
import src.tasks
import src.resetpassword