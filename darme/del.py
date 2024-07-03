from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import logging

app = Flask(__name__)
CORS(app)

# Load the trained model
model = tf.keras.models.load_model('delivery_time_model.h5')

# Constants
R = 6371  # Radius of the Earth in kilometers

# Configure logging
logging.basicConfig(level=logging.INFO)

# Convert degrees to radians
def deg_to_rad(degrees):
    return degrees * (np.pi / 180)

# Calculate distance using the haversine formula
def distcalculate(lat1, lon1, lat2, lon2):
    d_lat = deg_to_rad(lat2 - lat1)
    d_lon = deg_to_rad(lon2 - lon1)
    a = np.sin(d_lat / 2) ** 2 + np.cos(deg_to_rad(lat1)) * np.cos(deg_to_rad(lat2)) * np.sin(d_lon / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c

@app.route('/predict_delivery_time', methods=['POST'])
def predict_delivery_time():
    try:
        data = request.json
        logging.info("Received data: %s", data)

        required_fields = [
            "Restaurant_latitude", "Restaurant_longitude",
            "Delivery_location_latitude", "Delivery_location_longitude",
            "Delivery_person_Age", "Delivery_person_Ratings"
        ]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        distance = distcalculate(
            float(data['Restaurant_latitude']),
            float(data['Restaurant_longitude']),
            float(data['Delivery_location_latitude']),
            float(data['Delivery_location_longitude'])
        )

        input_data = np.array([
            float(data['Delivery_person_Age']),
            float(data['Delivery_person_Ratings']),
            distance
        ]).reshape(1, -1, 1)

        logging.info("Input data for prediction: %s", input_data)

        prediction = model.predict(input_data)
        logging.info("Prediction result: %s", prediction)

        return jsonify({'Prediction': float(prediction[0][0])})
    except Exception as e:
        logging.error("Error during prediction: %s", e)
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8080)
