from src import app
from flask import Flask, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo, ObjectId
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_session import Session
# from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
# from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin

app.config['SESSION_TYPE'] = 'filesystem'  # Ajusta la configuración según tus necesidades
Session(app)
# CORS(app)
# CORS(app, origins={"http:localhost:3000"})
# CORS(app, resources={r'/login/*':{"origins":{"http://localhost:3000"}}})
app.config['MONGO_URI'] = "mongodb://localhost:27017/pruebadb"
mongo = PyMongo(app)
dataSession = {}
session = {}
jwt = JWTManager(app)

db = mongo.db.userb

@app.route('/register', methods=['POST'])
def createRegister():
    existe_email = db.find_one({'email': request.json['email']})

    if existe_email is None:
        id = db.insert_one({
            'username': request.json['username'],
            'email': request.json['email'],
            'password': generate_password_hash(request.json['password'],  method='sha256', salt_length=16)
        })


        insertd_id = id.inserted_id
        return jsonify(str(insertd_id))
    else: 
        return jsonify({'msg': 'correo ya registrado'})

# @app.route('/register', methods=['GET'])
# def getRegister():
#     user = []
#     for doc in db.find():
#         user.append({
#             '_id': str(ObjectId(doc['_id'])),
#             'username': doc['username'],
#             'email': doc['email'],
#             'password': doc['password']
#         })
        
#     return jsonify(user)
@app.route('/register', methods=['GET'])
def getRegister():
    user_list = []
    for doc in db.find():
        # Verificar si 'username' está presente en el diccionario antes de intentar acceder a la clave
        if 'username' in doc:
            user_list.append({
                '_id': str(ObjectId(doc['_id'])),
                'username': doc['username'],
                'email': doc['email'],
                'password': doc['password']
            })
        else:
            # Puedes manejar el caso en el que 'username' no está presente, dependiendo de tus necesidades
            user_list.append({
                '_id': str(ObjectId(doc['_id'])),
                'message': 'Username not found'
            })
        
    return jsonify(user_list)


@app.route('/register/<id>', methods=['DELETE'])
def delete(id):

    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'usuario delete'})


@app.route('/login', methods=['POST'])
def loginL():
    user = db.find_one({'email': request.json['email']})

    if user and check_password_hash(user['password'], request.json['password']):
        dataSession['user_id'] = str(user['_id'])
        # dataSession['user_id'] = str(user['_id'])
        # return jsonify({'msg': 'Inicio de sesion exitoso'})
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token),200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401

    # if user and check_password_hash(user['password'], request.json['password']):
           
    #     access_token = create_access_token(identity=str(user['_id']))

    #     return jsonify(access_token=access_token), 200
    # else:
    #     return jsonify({'error': 'Credenciales incorrectas'}), 401
    


@app.route('/logout', methods=['POST'])
def logout():
    dataSession.pop('user_id', None)
    dataSession.pop('google_token', None)
    return jsonify({'msg': 'Logout successful'}), 200

@app.route('/protected', methods=['GET'])
def protected():
    if 'user_id' in dataSession or 'google_token' in dataSession:
        if 'user_id' in dataSession:
            user_id = dataSession['user_id']
            user = db.find_one({'_id': ObjectId(user_id)})
            return jsonify({'msg': f"Hola, usuario {user['username']}!"})
        elif 'google_token' in dataSession:
            return jsonify({'msg': 'Hello, Google user!'})
    else:
        return jsonify({'error': 'Acceso no autorizado'}), 401
