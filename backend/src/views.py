from src import app
from flask import Flask, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo, ObjectId
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_session import Session
from datetime import timedelta, datetime


# from flask_cors import CORS, cross_origin

app.config['SESSION_TYPE'] = 'filesystem'  # Ajusta la configuración según tus necesidades
app.config['MONGO_URI'] = "mongodb://localhost:27017/pruebadb"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=15)
mongo = PyMongo(app)
Session(app)
# dataSession = {}
session = {}


jwt = JWTManager(app)

db = mongo.db.userb

# @app.before_request
# def check_inactivity():
#     # Si el usuario está autenticado, verificar tiempo de inactividad
#     if 'user_id' in session:
#         last_activity = session.get('last_activity')
#         # Si el usuario ha estado inactivo más de 1 minuto, cerramos sesión
#         if datetime.utcnow() - last_activity > timedelta(minutes=15):
#             session.clear()
#             return jsonify({'error': 'Sesión cerrada por inactividad'}), 401
#         else:
#             # Actualizar la última actividad
#             session['last_activity'] = datetime.utcnow()
@app.before_request
def check_inactivity():
    if 'user_id' in session:
        last_activity = session.get('last_activity')
        if last_activity:
            elapsed_time = datetime.utcnow() - last_activity
            if elapsed_time > timedelta(minutes=15):
                session.clear()
                return jsonify({'error': 'Sesión cerrada por inactividad'}), 401
        # Actualizar la última actividad del usuario
        session['last_activity'] = datetime.utcnow()

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
        # return jsonify(str(insertd_id))
        return jsonify({'inserted_id': str(insertd_id), 'message': 'register creado correctamente  correctamente'}), 200
    else: 
        return jsonify({'msg': 'correo ya registrado'})


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
        session['user_id'] = str(user['_id'])
        # dataSession['user_id'] = str(user['_id'])
        # return jsonify({'msg': 'Inicio de sesion exitoso'})
        # session.permanent = True 
        session['last_activity'] = datetime.utcnow()
       
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token),200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401

    # if user and check_password_hash(user['password'], request.json['password']):
           
    #     access_token = create_access_token(identity=str(user['_id']))

    #     return jsonify(access_token=access_token), 200
    # else:
    #     return jsonify({'error': 'Credenciales incorrectas'}), 401
@app.route('/user-profile', methods=['GET'])
def user_profile():
    if 'user_id' in session or 'google_user_id' in session:
        if 'user_id' in session:
            user_id = session['user_id']
            user = db.find_one({'_id': ObjectId(user_id)})
        else:
            google_user_id = session['google_user_id']
            user = db.find_one({'google_user_id': google_user_id})

        if user:
            return jsonify({
                '_id': str(user['_id']),
                'username': user.get('username', user.get('google_name', '')),
                'email': user.get('email', user.get('google_email', '')),
            }), 200
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404
    else:
        return jsonify({'error': 'Acceso no autorizado'}), 401


@app.route('/user-profile/<id>', methods=['PUT'])
def update_profile(id):
    # Verificar si el usuario tiene permisos

    # Obtener datos del request
    data = request.json
    username = data.get("username")
   

    if not username:
        return jsonify({"error": "Username es requeridos"}), 400

    # Actualizar en la base de datos
    result = db.update_one(
        {'_id': ObjectId(id)},
        {'$set': {'username': username}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "No se realizaron cambios"}), 400

    return jsonify({"message": "Perfil actualizado correctamente"}), 200   
# @app.route('/user-profile/<id>', methods=['PUT'])
# def update_profile(id):
#     user_id = str(session.get("user_id") or session.get("google_user_id"))

#     if not check_role(id, user_id, "administrador"):
#         return jsonify({"error": "Permiso denegado tiene que ser admin "}), 403
    
#     titlename = request.json
#     titleemail = request.json


#     db.update_one(
#         {'_id': ObjectId(id)},
#         {'set':{
#             'username': titlename.get('username'),
#             'email': titleemail.get('email')
#         }}
#     )
#     return jsonify({'message': 'actualizado correctamente'}), 200


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    session.pop('google_token', None)
    session.clear()
    return jsonify({'msg': 'Logout successful'}), 200

@app.route('/protected', methods=['GET'])
def protected():
    if 'user_id' in session or 'google_token' in session:
        if 'user_id' in session:
            user_id = session['user_id']
            user = db.find_one({'_id': ObjectId(user_id)})
            return jsonify({'msg': f"Hola, usuario {user['username']}!"})
        elif 'google_token' in session:
            return jsonify({'msg': 'Hello, Google user!'})
    else:
        return jsonify({'error': 'Acceso no autorizado'}), 401
