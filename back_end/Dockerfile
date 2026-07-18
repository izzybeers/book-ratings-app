FROM python:3.11-slim

# Allow log messages to immediately appear in Google Cloud Logs
ENV PYTHONUNBUFFERED True

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code into the container
COPY . .

# Run the web service using Gunicorn.
# Cloud Run automatically sets the $PORT environment variable.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app

EXPOSE 8080