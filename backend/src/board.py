from flask import Flask, request, jsonify, g
from src import app
from src.views import mongo, session
from flask_pymongo import pymongo, ObjectId
from bson.errors import InvalidId
from flask_session import Session
from src.shareboard import check_role
from datetime import datetime
from babel.dates import format_datetime
import pytz 

TIMEZONE = pytz.timezone('America/Santo_Domingo')  # Cambia según tu zona horaria
LOCALE = 'es_DO' 
Session(app)

db = mongo.db.userb
dbb = mongo.db.boards
dbc = mongo.db.colunm
dbcd = mongo.db.card
dbdc = mongo.db.description



@app.route('/board', methods=['POST'])
def create_board():
    if 'user_id' in session or 'google_user_id' in session:
        # Verificar si el usuario inició sesión con Google
        if 'google_user_id' in session:
            current_user_id = session['google_user_id']
        else:
            # Si no es un usuario de Google, utilizar el 'user_id' normal
            current_user_id = session['user_id']
    # if 'user_id' in dataSession:
    #     current_user_id = dataSession['user_id']
       

        id = dbb.insert_one({
            'nameboard': request.json['nameboard'],
            'user_id': current_user_id,
            'shared_users': [
                {"user_id": current_user_id, "role": "administrador"}
            ]
            })

        insertd_id = id.inserted_id
        # return jsonify(str(insertd_id))
        return jsonify({'inserted_id': str(insertd_id), 'message': 'La tarea se ha agregado correctamente'}), 200
       
    
    else:
          return jsonify({'error': 'Acceso no autorizado'}), 401
    

@app.route('/board', methods=['GET'])
def get_boards():
    if 'user_id' in session or 'google_user_id' in session:
        current_user_id = session.get('google_user_id', session.get('user_id'))

        # Obtener tableros creados por el usuario
        created_boards = list(dbb.find({'user_id': current_user_id}))

        # Obtener tableros compartidos con el usuario
        shared_boards = list(dbb.find({
            'shared_users': {'$elemMatch': {'user_id': current_user_id}},
            'user_id': {'$ne': current_user_id}
        }))

        # Formatear la respuesta separando ambos grupos
        response = {
            'created_boards': [{
                '_id': str(board['_id']),
                'nameboard': board.get('nameboard', 'Título no disponible'),
            } for board in created_boards],
            'shared_boards': [{
                '_id': str(board['_id']),
                'nameboard': board.get('nameboard', 'Título no disponible'),
            } for board in shared_boards],
        }

        return jsonify(response), 200

    return jsonify({'error': 'Acceso no autorizado'}), 401







    
@app.route('/board/<id>', methods=['PUT'])
def update_board(id):

    user_id = str(session.get("user_id") or session.get("google_user_id"))
    
    if not check_role(id, user_id, "administrador"):
        return jsonify({"error": "Permiso denegado tiene que ser admin "}), 403
    
    board_data = request.json
    dbb.update_one(
        {'_id': ObjectId(id)},
        {'$set': {
            'nameboard': board_data.get('nameboard')
        }}
    )
    return jsonify({'message': 'actualizado correctamente'}), 200

@app.route('/board/<id>', methods=['DELETE'])
def delete_board(id):
    user_id = str(session.get("user_id") or session.get("google_user_id"))

    # Verificar permisos de administrador
    if not check_role(id, user_id, "administrador"):
        return jsonify({"error": "Permiso denegado"}), 403

    try:
        # Convertir id a ObjectId
        board_id = ObjectId(id)

        # Eliminar descripciones asociadas a las tarjetas dentro de este tablero
        card_ids = [card['_id'] for card in dbcd.find({'board_id': board_id})]
        dbdc.delete_many({'card_id': {'$in': card_ids}})

        # Eliminar tarjetas asociadas a las columnas del tablero
        dbcd.delete_many({'board_id': board_id})

        # Eliminar columnas asociadas al tablero
        dbc.delete_many({'board_id': board_id})

        # Finalmente, eliminar el tablero
        result = dbb.delete_one({'_id': board_id})

        if result.deleted_count > 0:
            return jsonify({'message': 'Tablero y todos sus datos asociados eliminados correctamente'}), 200
        else:
            return jsonify({'message': 'Tablero no encontrado'}), 404

    except InvalidId:
        return jsonify({'error': 'ID de tablero inválido'}), 400





@app.route('/column', methods=['POST'])
def create_column():

    user_id = session.get("user_id") or session.get("google_user_id")
    # Verificar si el ID del tablero se envía en la solicitud
    board_id = request.json.get('board_id')
   
    
    if not board_id:
        return jsonify({'message': 'ID del tablero es requerido'}), 400
    
    # Verificar si el tablero existe
    board = dbb.find_one({'_id': ObjectId(board_id)})
    
    if not board:
        return jsonify({'message': 'Tablero no encontrado'}), 404
    
    is_creator = board.get('user_id') == user_id
    has_role = check_role(board_id, user_id, "administrador") or check_role(board_id, user_id, "miembro")

    if not (is_creator or has_role):
        return jsonify({"error": "Permiso denegado"}), 403
    
    # Insertar la nueva columna asociada al tablero especificado
    id = dbc.insert_one({
        'titlecolumn': request.json['titlecolumn'],
        'board_id': ObjectId(board_id),  # Asociar la columna con el tablero enviado
       
        
    })
    
    inserted_id = id.inserted_id
    return jsonify({
        'inserted': str(inserted_id),
        'message': 'Columna agregada correctamente',
        'board_id': str(board_id)
    }), 200

@app.route('/board/<board_id>/column', methods=['GET'])
def get_columns_by_board(board_id):
    columns = []
    for doc in dbc.find({'board_id': ObjectId(board_id)}):
        columns.append({
            '_id': str(ObjectId(doc['_id'])),
            'titlecolumn': doc['titlecolumn'],
            'board_id': str(ObjectId(doc['board_id']))
        })
    return jsonify(columns), 200

# Obtener todas las columnas sin necesidad de proporcionar board_id
@app.route('/column', methods=['GET'])
def get_all_colunms():
    colunms = []
    for doc in dbc.find():
        colunms.append({
            '_id': str(ObjectId(doc['_id'])),
            'titlecolumn': doc['titlecolumn'],
            'board_id': str(ObjectId(doc['board_id']))
        })
    return jsonify(colunms), 200

@app.route('/card/', methods=['POST'])
def create_card():
    user_id = session.get("user_id") or session.get("google_user_id")
    board_id = request.json.get('board_id')

    if not board_id:
        return jsonify({'message': 'ID del tablero es requerido'}), 400

    if not check_role(board_id, user_id, "administrador") and not check_role(board_id, user_id, "miembro"):
        return jsonify({"error": "Permiso denegado"}), 403

    list_number = request.json['list']
    position = request.json.get('position', 0)

    # Obtiene la fecha y hora actuales
    created_at = datetime.utcnow()

    id = dbcd.insert_one({
        'title': request.json['title'],
        'list': list_number,
        'position': position,
        'board_id': ObjectId(board_id),
        'created_at': created_at  # Agrega la fecha y hora de creación
    })
    inserted_id = id.inserted_id
    return jsonify({'inserted': str(inserted_id), 'message': 'Agregado correctamente'}), 200


@app.route('/card', methods=['GET'])
def get_all_colun():
    card = []
    for doc in dbcd.find().sort('position', 1):
        # Convertir UTC a hora local y formatear
        created_at = doc.get('created_at')
        if created_at:
            created_at = created_at.replace(tzinfo=pytz.utc).astimezone(TIMEZONE)  # Convertir a hora local
            created_at = format_datetime(created_at, "EEEE d 'de' MMMM 'de' yyyy, h:mm a", locale=LOCALE)

        card.append({
            '_id': str(ObjectId(doc['_id'])),
            'title': doc['title'],
            'list': doc['list'],
            'position': doc.get('position', 0),
            'created_at': created_at  # Fecha en formato español legible
        })
    return jsonify(card), 200


@app.route('/card/<card_id>', methods=['PUT'])
def update_card(card_id):
    user_id = session.get("user_id") or session.get("google_user_id")
    
    card_data = request.json
    list_id = card_data.get('list')  # Nueva columna destino
    position = card_data.get('position', 0)  # Nueva posición en la columna destino

    # Verificar si la tarjeta existe
    card = dbcd.find_one({'_id': ObjectId(card_id)})
    if not card:
        return jsonify({'message': 'Tarjeta no encontrada'}), 404
    
    board_id = card.get('board_id')
    if not check_role(board_id, user_id, "administrador") and not check_role(board_id, user_id, "miembro"):
        return jsonify({"error": "Permiso denegado"}), 403

    # Mantener valores existentes si no se proporcionan
    if list_id is None:
        list_id = card.get('list')

    update_fields = {
        'title': card_data.get('title', card['title']),
        'list': list_id,
        'position': position,
    }

    # Actualizar la tarjeta
    dbcd.update_one(
        {'_id': ObjectId(card_id)},  # Filtro
        {'$set': {k: v for k, v in update_fields.items() if v is not None}}  # Actualizaciones
    )
    return jsonify({'message': 'Tarjeta actualizada correctamente'}), 200


@app.route('/description', methods=['POST'])
def description():
    user_id = session.get("user_id") or session.get("google_user_id")
    card_id = request.json.get('card_id')

    if not card_id:
        return jsonify({'message': 'ID de la tarjeta es requerido'}), 400

    # Verificar si la tarjeta existe
    card = dbcd.find_one({'_id': ObjectId(card_id)})
    if not card:
        return jsonify({'message': 'Tarjeta no encontrada'}), 404

    # Verificar si la tarjeta está asociada a un tablero
    board_id = card.get('board_id')
    if not board_id:
        return jsonify({'error': 'La tarjeta no está asociada a ningún tablero'}), 400

    # Verificar permisos del usuario para el tablero
    if not check_role(board_id, user_id, "administrador") and not check_role(board_id, user_id, "miembro"):
        return jsonify({"error": "Permiso denegado"}), 403

    # Verificar si ya existe una descripción para esta tarjeta
    existing_description = dbdc.find_one({'card_id': ObjectId(card_id)})
    if existing_description:
        return jsonify({'message': 'Esta tarjeta ya tiene una descripción. Actualízala en su lugar.'}), 400

    # Crear la descripción
    id = dbdc.insert_one({
        'description': request.json['description'],
        'card_id': ObjectId(card_id)
    })
    inserted_id = id.inserted_id
    return jsonify({'inserted': str(inserted_id), 'message': 'Descripción agregada correctamente'}), 200



@app.route('/description/<card_id>', methods=['GET'])
def get_description (card_id):
    
    description = []
    for doc in dbdc.find({'card_id': ObjectId(card_id)}):
        description.append({
            '_id': str(ObjectId(doc['_id'])),
            'description': doc['description'],
            'card_id': str(ObjectId(doc['card_id']))
              
        })
    return jsonify(description)

@app.route('/description/<card_id>', methods=['PUT'])
def update_description(card_id):
    user_id = session.get("user_id") or session.get("google_user_id")
    
    # Verificar si la tarjeta existe
    card = dbcd.find_one({'_id': ObjectId(card_id)})
    if not card:
        return jsonify({'message': 'Tarjeta no encontrada'}), 404
    
    board_id = card.get('board_id')
    if not check_role(board_id, user_id, "administrador") and not check_role(board_id, user_id, "miembro"):
        return jsonify({"error": "Permiso denegado"}), 403

    # Actualizar descripción
    dbdc.update_one(
        {'card_id': ObjectId(card_id)},
        {"$set": {
            'description': request.json['description']
        }}
    )
    return jsonify({'msg': 'Descripción actualizada correctamente'}), 200

   


@app.route('/description/<id>', methods=['DELETE'])
def delete_description(id):
    user_id = session.get("user_id") or session.get("google_user_id")
    if not check_role(id, user_id, "administrador"):
        return jsonify({"error": "Permiso denegado"}), 403

    dbdc.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'usuario delete'})



@app.route('/card/<card_id>', methods=['DELETE'])
def delete_card(card_id):

    user_id = session.get("user_id") or session.get("google_user_id")
    
    try:
        # Verifica si la tarjeta existe
        card = dbcd.find_one({'_id': ObjectId(card_id)})
        if not card:
            return jsonify({'message': 'Tarjeta no encontrada'}), 404
        board_id = card.get('board_id')
        if not check_role(board_id, user_id, "administrador") and not check_role(board_id, user_id, "administrador"):
            return jsonify({"error": "Permiso denegado"}), 403

        
        dbdc.delete_many({'card_id': ObjectId(card_id)})

        # Elimina la tarjeta
        result = dbcd.delete_one({'_id': ObjectId(card_id)})

        if result.deleted_count > 0:
            return jsonify({'message': 'Tarjeta y descripciones asociadas eliminadas correctamente'}), 200
        else:
            return jsonify({'message': 'Error al eliminar la tarjeta'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 400

