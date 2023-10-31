from flask import Flask, request, json, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from src import app
from src.tasks import mongo
import yagmail
import random

db = mongo.db.userb




@app.route('/resetpassword', methods=['GET','POST'])
def resetpassword ():
    user = db.find_one({'email': request.json['email'] })
    # email = request.json.get('email')  # Obtener el correo electrónico del JSON enviado

    # user = db.find_one({'email': email})

    if user:
        newpassword = str(random.randint(1000000, 9999999))
        

        db.update_one({'email': request.json['email']},{'$set': {'password':generate_password_hash(newpassword)}})


        yag = yagmail.SMTP('adrianrosario660@gmail.com', 'wlggxbvvgkskrkum')
        body = f'Saludos, tu nueva contraseña es: {newpassword}'
        yag.send(to=user['email'], subject='Contraseña olvidada', contents=body)
        yag.close()

        return jsonify({'msg': 'hola'})
    else:
        return jsonify({'msg': 'correo no encontrado'})
        