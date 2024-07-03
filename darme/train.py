import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
import pickle

# Load dataset
dataset = pd.read_csv('Training.csv')

# Prepare data
X = dataset.drop('prognosis', axis=1)
y = dataset['prognosis']

# Encode target labels
le = LabelEncoder()
y = le.fit_transform(y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=20)

# Train model
model = SVC(kernel='linear')
model.fit(X_train, y_train)

# Save model and label encoder
pickle.dump(model, open('svc.pkl', 'wb'))
pickle.dump(le, open('label_encoder.pkl', 'wb'))

print("Model and label encoder saved successfully.")
