import os
import importlib
import book_api_helper_funs
from book_data_setup import google_books_api_key, googlebooks_endpoint
from book_api_helper_funs import process_googlebook
import requests
import string
import re
import pprint
import time
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/search', methods=['GET'])
# openlibrary_q = f"{title.replace(' ','+')}    {author.replace(' ','+')} language:eng"
def pull_book_info():   
    title = request.args.get('title', '')
    author = request.args.get('author', '')
    all_matches = request.args.get('all_matches')
    strict = request.args.get('strict')
    text = request.args.get('text')

    if (not title or not author) and not text:
        return jsonify({"error": "Missing search query"}), 400
    if not title or not author:
        strict = False
        all_matches = False
        title = ''
        author = ''
    elif not text:
        strict = True
        all_matches = True
    else:
        strict = True
        #keep all_matches as whatever user passed

    if not all_matches:
        all_matches = False
    
    if strict == True:
        googlebooks_q = f"intitle:{title.replace(' ','+')}+inauthor:{author.replace(' ','+')}"
    else:
        googlebooks_q = text.strip().replace(' ', '+')

    googlebooks_params = {
        'q': googlebooks_q,
        'key':google_books_api_key, 
        'maxResults': 20,
        "langRestrict": "en",
        "printType": "books"
    }
    max_retries = 3
    googlebooks_response = None

    # Retry loop
    for i in range(max_retries):
        try:
            googlebooks_response = requests.get(googlebooks_endpoint, params=googlebooks_params, timeout=5)
            print(f"Attempt {i+1}: Received status code {googlebooks_response.status_code}", flush=True)
            if googlebooks_response.status_code == 200:
                break
            if googlebooks_response.status_code in [503, 502, 504] and i < max_retries - 1:
                print(f"Status {googlebooks_response.status_code} detected. Retrying in 1 second...", flush=True)
                time.sleep(1) 
                continue
            break
            
        except requests.exceptions.RequestException as e:
            print(f"Attempt {i+1} failed with exception: {e}", flush=True)
            if i < max_retries - 1:
                time.sleep(1)
                continue
            break
    if not googlebooks_endpoint:
        raise RuntimeError(
            "Missing Cloud Run environment variable: googlebooks_endpoint"
        )

    if not google_books_api_key:
        raise RuntimeError(
            "Missing Cloud Run environment variable: google_books_api_key"
        )

    googlebooks_data = []

    if googlebooks_response.status_code == 200:
        googlebooks_data = process_googlebook(
            title,
            author,
            googlebooks_response.json(),
            all_matches
        )

    return googlebooks_data

import os

if __name__ == '__main__':
    # Cloud Run provides the PORT environment variable
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)