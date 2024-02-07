from flask import Flask, current_app, request, jsonify
from flask_jwt_extended import decode_token
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo, ObjectId
from src import app
from src.tasks import mongo
import yagmail
import random
from src.views import session, dataSession



db = mongo.db.userb




@app.route('/resetpassword', methods=['GET','POST'])
def resetpassword ():
    user = db.find_one({'email': request.json['email'] })
   

    if user:
        newpassword = str(random.randint(1000000, 9999999))
        

        db.update_one({'email': request.json['email']},{'$set': {'password':generate_password_hash(newpassword)}})


        yag = yagmail.SMTP('adrianrosario660@gmail.com', 'wlggxbvvgkskrkum')
        body = f'Saludos, tu nueva contraseña es: {newpassword}'
        yag.send(to=user['email'], subject='Contraseña olvidada', contents=body)
        yag.close()

        return jsonify({'msg': 'password changed successfully'})
    else:
        return jsonify({'msg': 'Email not found'})
        



@app.route('/createpassword', methods=['PUT'])
def create_password():
    user_id = dataSession.get('user_id')

    if not user_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401

    print(user_id)
    print("Request Json:", request.json)

    user = db.find_one({'_id': ObjectId(user_id)})

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if not check_password_hash(user['password'], request.json['password']):
        return jsonify({'msg': 'Contraseña incorrecta'}), 401

    new_password = generate_password_hash(request.json['newpassword'])

    db.update_one({'_id': ObjectId(user_id)}, {"$set": {'password': new_password}})

    
    response_data = {'msg': 'Contraseña actualizada', 'id': str(user_id)}
    return jsonify(response_data), 200

