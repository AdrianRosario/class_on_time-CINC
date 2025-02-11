from flask import Flask, request, jsonify
from src import app
from src.views import mongo, session
from flask_pymongo import ObjectId
from bson.errors import InvalidId

dbb = mongo.db.boards
db = mongo.db.userb

def check_role(board_id, user_id, role):
    board = dbb.find_one({'_id': ObjectId(board_id)})
    if not board:
        return False
    for user in board.get('shared_users', []):
        if user['user_id'] == user_id and user['role'] == role:
            return True
    return False



@app.route('/board/<board_id>/share', methods=['POST'])
def share_board(board_id):
    email = request.json.get("email")
    role = request.json.get("role")  # Recuperar el tipo de usuario (rol)
    
    if not email:
        return jsonify({"error": "Se requiere el correo electrónico del usuario"}), 400

    if not role:
        return jsonify({"error": "Se requiere el tipo de usuario"}), 400

    # Buscar el usuario por correo electrónico
    user = db.find_one({"email": email})
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    user_id = str(user["_id"])  # Asegurarse de que el ID esté en formato cadena

    try:
        # Agregar al usuario con su rol al array shared_users
        result = dbb.update_one(
            {"_id": ObjectId(board_id)},
            {"$addToSet": {
                "shared_users": {"user_id": user_id, "role": role}
            }}  # Usar un subdocumento para roles
        )
    except InvalidId:
        return jsonify({"error": "ID del tablero inválido"}), 400

    # Verificar si el tablero fue encontrado y actualizado
    if result.matched_count == 0:
        return jsonify({"error": "Tablero no encontrado"}), 404

    if result.modified_count == 0:
        return jsonify({"message": "El usuario ya tiene acceso a este tablero"}), 200

    return jsonify({"message": "Tablero compartido con éxito"}), 200

@app.route('/board/<board_id>/user-role', methods=['GET'])
def get_user_role(board_id):
    if 'user_id' in session or 'google_user_id' in session:
        user_id = session.get('google_user_id', session.get('user_id'))
        
        board = dbb.find_one({'_id': ObjectId(board_id)})
        if not board:
            return jsonify({'error': 'Tablero no encontrado'}), 404
        
        # Verificar si el usuario es el creador
        if str(board.get('user_id')) == str(user_id):
            return jsonify({'role': 'administrador'}), 200
        
        # Verificar si el usuario tiene un rol específico
        for user in board.get('shared_users', []):
            if user['user_id'] == str(user_id):
                return jsonify({'role': user['role']}), 200
        
        return jsonify({'role': 'observador'}), 200  # Rol por defecto
    return jsonify({'error': 'Acceso no autorizado'}), 401

@app.route('/shared_boards', methods=['GET'])
def get_shared_boards():
    if 'user_id' in session or 'google_user_id' in session:
        current_user_id = session.get('google_user_id', session.get('user_id'))
        
        
        shared_boards = list(dbb.find(
            {
                'shared_users': {'$elemMatch': {'user_id': str(current_user_id)}},
                'user_id': {'$ne': current_user_id}  
            },
            {'_id': 1, 'user_id': 1, 'nameboard': 1, 'shared_users': 1}  # Campos necesarios
        ))

        # Formatear los resultados
        shared_boards = [
            {
                '_id': str(board['_id']),
                'user_id': str(board['user_id']),
                'nameboard': board['nameboard'],
                'shared_users': board['shared_users']
            }
            for board in shared_boards
        ]
       
        
        return jsonify(shared_boards), 200
    
    else:
        return jsonify({'error': 'Acceso no autorizado'}), 401
    

@app.route('/board/<board_id>/shared-users', methods=['GET'])
def get_shared_users(board_id):
    try:
        board = dbb.find_one({'_id': ObjectId(board_id)})
        if not board:
            return jsonify({'error': 'Tablero no encontrado'}), 404

        shared_users = board.get('shared_users', [])

        # Obtener detalles de cada usuario compartido
        user_details = []
        for shared_user in shared_users:
            user_id = shared_user.get('user_id')
            user = db.find_one({'_id': ObjectId(user_id)}, {'username': 1, 'email': 1})

            if user:
                user_details.append({
                    'user_id': str(user['_id']),
                    'username': user.get('username', 'Desconocido'),
                    'email': user.get('email', 'No disponible'),
                    'role': shared_user.get('role', 'No asignado')
                })

        return jsonify(user_details), 200

    except InvalidId:
        return jsonify({'error': 'ID del tablero inválido'}), 400





