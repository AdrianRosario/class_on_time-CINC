from datetime import datetime
from flask import Flask, redirect, url_for,  jsonify
import json
from flask_oauthlib.client import OAuth
import requests
from src import app
from src.views import mongo, session
from flask_cors import CORS
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import jwt 


CORS(app)

db = mongo.db.userb

oauth = OAuth(app)





google_client_id = '928038560309-smhj1p5bq20mab6p0ar0rmgunjdafllg.apps.googleusercontent.com'
google_client_secret = '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'
google_redirect_uri = "http://localhost:8080/login/authorized"


google = oauth.remote_app(
    'google',
    consumer_key=google_client_id,
    consumer_secret=google_client_secret,
    request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email openid profile'},
    base_url='https://www.googleapis.com/oauth2/v1',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth'
)



@app.route('/get-google-auth-url')
def get_google_auth_url():
    return jsonify({'url': url_for('google_login', _external=True)})


@app.route('/login/google')
def google_login():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/login/authorized')
def authorized():
    response = google.authorized_response()

    # Log the response for debugging
    print('Google OAuth Response:', response)

    if response is None or response.get('access_token') is None:
        return jsonify({'msg': 'login failed'})

    google_id_token = response.get('id_token')
    if google_id_token:
        # Decode the JWT token to get user information
        decoded_token = jwt.decode(google_id_token, options={"verify_signature": False})

       

        user_data = {
            'google_user_id': decoded_token['sub'],
            'google_email': decoded_token['email'],
            'google_name': decoded_token['name'],
            'last_login': datetime.now()
        }

        existing_user = db.find_one({'google_user_id': decoded_token['sub']})

        if existing_user:
            # Update existing user
            result = db.update_one(
                {'_id': existing_user['_id']},
                {'$set': user_data}
            )
            print(f"Updated user. Matched {result.matched_count} document(s). Modified {result.modified_count} document(s).")
        else:
            # Insert new user
            result = db.insert_one(user_data)
            print(f"Inserted new user. Inserted ID: {result.inserted_id}")
       
                
       


        # Save user information in the session
        session['google_user_id'] = decoded_token.get('sub')
        session['google_email'] = decoded_token.get('email')
        session['google_name'] = decoded_token.get('name')
        session['google_token'] = response['access_token']

        print('User Name:', decoded_token.get('name'))
        print('User Email:', decoded_token.get('email'))
        print('User sub:', decoded_token.get('sub'))
        
                # Save user information in the session
        
    redirect_url = '/espaciodetrabajo' if 'google_token' in session else '/'
    return redirect(f"http://localhost:3000{redirect_url}?access_token={session.get('google_token')}")



@app.route('/logout')
def logout_google():
    session.pop('user_id', None)
    session.pop('google_token', None)
    return jsonify({'msg': 'session closed'})


@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')



@app.route('/usuario/info', methods=['GET'])
def obtener_informacion_usuario():
    # Verificar si el usuario está autenticado
    if 'google_token' not in session:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
  
    usuario = db.find_one({'google_user_id': session['google_user_id']})

    if usuario:
        # Devolver la información del usuario en formato JSON
        return jsonify({
            'google_user_id': usuario['google_user_id'],
            'google_email': usuario['google_email'],
            'google_name': usuario['google_name'],
            'last_login': usuario['last_login']
        })
    else:
        return jsonify({'error': 'Usuario no encontrado en la base de datos'}), 404