from flask import Flask, request, json, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from src import app
from src.tasks import mongo
import yagmail
import random
from flask_pymongo import PyMongo, ObjectId

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
        

@app.route('/hola/<id>', methods=['PUT'])
def createPassword(id):
    if 'password' not in request.json or 'nuevo_password' not in request.json:
        return jsonify({'msg': 'Faltan campos en la solicitud'}), 400

    
    user = db.find_one({'_id': ObjectId(id)})

   
    if user and check_password_hash(user['password'], request.json['password']):
        
        db.update_one({'_id': ObjectId(id)}, {"$set": {'password': generate_password_hash( request.json['nuevo_password'])}})
        return jsonify({'msg': 'Contraseña actualizada correctamente'})

    return jsonify({'msg': 'Contraseña actual incorrecta'}), 401

    

