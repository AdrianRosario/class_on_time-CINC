from flask import Flask, request, jsonify
# from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from flask_login import current_user
from flask_session import Session
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request
from src import app
from flask_pymongo import PyMongo, ObjectId
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from src.views import mongo, dataSession, session



db = mongo.db.taskdb



Session(app)


@app.route('/tasks', methods=[ 'POST'])
def creatTasks():
    if 'user_id' in session:
        current_user_id = session['user_id']
        id = db.insert_one({  
            'user_id': ObjectId(current_user_id),
            'nameTasks': request.json['nameTasks'],
            'description': request.json['description'],
            'guy': request.json['guy'],
            'date': request.json['date']})

        insertd_id = id.inserted_id
        return jsonify(str(insertd_id))
    else:
          return jsonify({'error': 'Acceso no autorizado'}), 401


@app.route('/tasks', methods=['GET'])
def get_tasks():
    if 'user_id' in session:
        current_user_id = session['user_id']
        task = []
        for doc in db.find({'user_id':ObjectId(current_user_id)}):
            task.append({
                '_id':str(ObjectId(doc['_id'])),
                'user_id':str(ObjectId(doc['user_id'])),
                'nameTasks': doc['nameTasks'],
                'description': doc['description'],
                'guy': doc['guy'],
                'date': doc['date'],
                

            })
        return jsonify(task)
    else:
        return jsonify({'error': 'Acceso no autorizado'}), 401

@app.route('/task/<id>', methods=['GET'])
def getTask(id):
    tasks = db.find_one({'_id': ObjectId(id)})

    if tasks is None:
        return jsonify({'error': 'task not found'}), 404
    

    return jsonify({
        '_id': str(ObjectId(tasks['_id'])),
        'nameTasks': tasks['nameTasks'],
        'description': tasks['description'],
        'guy': tasks['guy'],
        'date': tasks['date']
    })


@app.route('/tasks/<id>', methods=['DELETE'])
def deleteTask(id):

    db.delete_one({'_id': ObjectId(id)})

    return jsonify({ 'msg': 'task delete'})
    

@app.route('/tasks/<id>', methods=['PUT'])
def updateTask(id):

    db.update_one({'_id': ObjectId(id)},{'$set':{
        'nameTasks': request.json['nameTasks'],
        'description': request.json['description'],
        'guy': request.json['guy'],
        'date': request.json['date']
    }
    })

    return jsonify({'msg': 'task update'})


