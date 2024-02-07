from flask_login import LoginManager
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
app.secret_key =  "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"


CORS(app, origins=["http://localhost:3000"])

import src.views
import src.tasks
import src.resetpassword
import src.googlelogin