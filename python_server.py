from flask import Flask, request, jsonify
import mysql.connector
import os
from flask_cors import CORS 
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
#CORS(app, origins=["http://127.0.0.1:5500"]) # Allow CORS for specific origin

# MySQL Connection Configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "web_portfolio_db"
}

# Upload folder for profile pictures
UPLOAD_FOLDER = os.path.join('static', 'uploads')  # Create this folder in your project directory
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}  # Allowed file types

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/submit_testimonial', methods=['POST'])
def submit_testimonial():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        name = request.form['name']
        client_position = request.form['position']
        feedback = request.form['feedback']
        rating = int(request.form['rating'])
        profile_url = "" # Initialize
        

        if 'profile' in request.files:
            profile = request.files['profile']
            if profile and allowed_file(profile.filename):
                filename = secure_filename(profile.filename)                    
                profile.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                profile_url = filename  #  Only store the filename in the DB)   
                        

        cursor.execute(
            "INSERT INTO testimonials (name, client_position, feedback, rating, profile_url_name) VALUES (%s, %s, %s, %s, %s)",
            (name, client_position, feedback, rating, profile_url)
        )
        conn.commit()
        
        return jsonify({
            "message": "Testimonial submitted successfully!",
            "name": name,
            "position": client_position,
            "feedback": feedback,
            "rating": rating,
            "profile_image": filename  # this can be null if no file uploaded
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    finally:
        cursor.close()
        conn.close()
        
        
@app.route('/get_testimonials', methods=['GET'])
def get_testimonials():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT name, client_position, feedback, rating, profile_url_name FROM testimonials")
        testimonials = cursor.fetchall()
        
        # Format the data to return it in JSON format
        response_data = []
        for testimonial in testimonials:
            response_data.append({
                "name": testimonial[0],
                "position": testimonial[1],
                "feedback": testimonial[2],
                "rating": testimonial[3],
                "profile_image": testimonial[4] if testimonial[4] else 'https://via.placeholder.com/80'
            })

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        name = request.form['name']
        email = request.form['email']
        subject = request.form['subject']
        message = request.form['message']
        
        
         # Connect and insert into MySQL
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO contacts (name, email, subject, message) VALUES (%s, %s, %s, %s)",
            (name, email, subject, message)
        )
       
        conn.commit()

        return jsonify({"message": "Message sent successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, host='0.0.0.0', port=8080)
