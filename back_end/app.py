import os
import importlib
import book_api_helper_funs
from book_data_setup import google_books_api_key, googlebooks_endpoint
from book_api_helper_funs import process_googlebook
import requests
import string
import re
import pprint
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
    
    if strict == True | strict == 'True':
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

    # openlibrary_params = {
    #         "q": openlibrary_q,
    #         "fields": "title,author_name,subject,first_publish_year",
    #         "limit": 5
    #     }

    googlebooks_response = requests.get(googlebooks_endpoint, params = googlebooks_params)
    # openlibrary_response = requests.get(openlibrary_endpoint, params = openlibrary_params)
    print(googlebooks_response.json())
    if(googlebooks_response.status_code == 200 and googlebooks_response.json().get('totalItems') > 0):
        googlebooks_data = process_googlebook(title, author, googlebooks_response.json(), all_matches)

    # if(openlibrary_response.status_code == 200):
    #     openlibrary_data = process_openlibrary_data(title, openlibrary_response.json())

    return(googlebooks_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
            