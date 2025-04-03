from flask import Flask, request, jsonify
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# MySQL Connection Configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "delohz.k.01/",
    "database": "portfolio_db"
}

# Upload folder for profile pictures
UPLOAD_FOLDER = 'uploads'  # Create this folder in your project directory
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
        feedback = request.form['feedback']
        rating = int(request.form['rating'])
        profile_url = "" # Initialize

        if 'profile' in request.files:
            profile = request.files['profile']
            if profile and allowed_file(profile.filename):
                filename = secure_filename(profile.filename)
                profile_url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                profile.save(profile_url)  # Save the file
                #  Important:  Store the *path* (profile_url) in your database, not the raw file data


        cursor.execute(
            "INSERT INTO testimonials (name, feedback, rating, profile_url_name) VALUES (%s, %s, %s, %s)",
            (name, feedback, rating, profile_url)
        )
        conn.commit()

        # return jsonify({"message": "Testimonial submitted successfully!"}), 200
        # Return the new testimonial data, including profile image path
        return jsonify({
            "message": "Testimonial submitted successfully!",
            "name": name,
            "feedback": feedback,
            "rating": rating,
            "profile_image": profile_url if profile_url else "https://via.placeholder.com/80"  # Fallback if no profile image
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        name = request.form['name']
        email = request.form['email']
        subject = request.form['subject']
        message = request.form['message']

        cursor.execute(
            "INSERT INTO contacts (name, email, subject, message) VALUES (%s, %s, %s, %s)",
            (name, email, subject, message)
        )
        conn.commit()

        return jsonify({"message": "Message sent successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, host='0.0.0.0', port=8080)
