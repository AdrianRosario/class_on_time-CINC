from flask import Flask, request, jsonify
from src import app
from src.views import mongo
from flask_pymongo import pymongo, ObjectId

dbb = mongo.db.boards
dbc = mongo.db.colunm
dbcd = mongo.db.card
dbdc = mongo.db.description

@app.route('/board', methods=['POST'])
def board():

    id = dbb.insert_one({
        'nameboard':request.json['nameboard']
    }) 
    insertd_id = id.inserted_id
    return jsonify({'insertad': str(insertd_id), 'message': 'agregado correctamente'}), 200

@app.route('/board', methods=['GET'])
def get_board ():
    board = []
    for doc in dbb.find():
        board.append({
            '_id': str(ObjectId(doc['_id'])),
            'nameboard': doc['nameboard']
        })
    return jsonify(board)


@app.route('/colunm', methods=['POST'])
def colunm():

    id = dbc.insert_one({
        'titlecolunm':request.json['titlecolunm']
    }) 
    insertd_id = id.inserted_id
    return jsonify({'insertad': str(insertd_id), 'message': 'agregado correctamente'}), 200

@app.route('/colunm', methods=['GET'])
def get_colunm ():
    colunm = []
    for doc in dbc.find():
        colunm.append({
            '_id': str(ObjectId(doc['_id'])),
            'titlecolunm': doc['titlecolunm']
            
        })
    return jsonify(colunm)

@app.route('/description', methods=['POST'])
def description():

    id = dbdc.insert_one({
        'description':request.json['description']
    }) 
    insertd_id = id.inserted_id
    return jsonify({'insertad': str(insertd_id), 'message': 'agregado correctamente'}), 200

@app.route('/description', methods=['GET'])
def get_description ():
    description = []
    for doc in dbdc.find():
        description.append({
            '_id': str(ObjectId(doc['_id'])),
            'description': doc['description']
            
        })
    return jsonify(description)

@app.route('/description/<id>', methods=['PUT'])
def update_description (id):

    dbdc.update_one({'_id': ObjectId(id)},{"$set": {

        'description': request.json['description']
    }})
    return jsonify({'msg': 'description  update'})

@app.route('/description/<id>', methods=['DELETE'])
def delete_description(id):

    dbdc.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'usuario delete'})


# @app.route('/card', methods=['POST'])
# def card():

#     max_list = dbcd.find_one(sort=[("list", -1)])

#     # Si no hay tarjetas en la base de datos, comenzar numerando las listas desde 1
#     if max_list is None:
#         new_list_number = 1
#     else:
#         # Incrementar el número de lista máximo encontrado en 1
#         new_list_number = max_list['list'] + 1

#     id = dbcd.insert_one({
#         'title':request.json['title'],
#         # 'body': request.json['body'],
#         'list': new_list_number
#     }) 
#     insertd_id = id.inserted_id
#     return jsonify({'insertad': str(insertd_id), 'message': 'agregado correctamente'}), 200

@app.route('/card', methods=['POST'])
def card():
    list_number = request.json['list']
    position = request.json.get('position', 0)

    id = dbcd.insert_one({
        'title': request.json['title'],
        'list': list_number,
        'position': position
    }) 
    inserted_id = id.inserted_id
    return jsonify({'inserted': str(inserted_id), 'message': 'agregado correctamente'}), 200


@app.route('/card', methods=['GET'])
def get_card ():
    card = []
    for doc in dbcd.find().sort('position', 1):
        card.append({
            '_id': str(ObjectId(doc['_id'])),
            'title': doc['title'],
            'list': doc['list'],
            'position': doc.get('position', 0)
            
        })
    return jsonify(card)

@app.route('/card/<id>', methods=['PUT'])
def update_card(id):
    card_data = request.json
    dbcd.update_one(
        {'_id': ObjectId(id)},
        {'$set': {
            'title': card_data.get('title'),
            'list': card_data.get('list'),
            'position': card_data.get('position')
        }}
    )
    return jsonify({'message': 'actualizado correctamente'}), 200

@app.route('/card/<id>', methods=['DELETE'])
def delete_card(id):

    dbcd.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'usuario delete'})