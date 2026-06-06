from supabase import create_client, Client
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()

supabase_api_key = os.environ.get('supabase_api_key')
supabase_endpoint= os.environ.get('supabase_endpoint')
googlebooks_endpoint = os.environ.get('googlebooks_endpoint')
google_books_api_key = os.environ.get('google_books_api_key')

supabase: Client = create_client(supabase_endpoint, supabase_api_key)

ratings = pd.DataFrame(supabase.table('BookRatings').select("*").execute().data)
book_info = pd.DataFrame(supabase.table('BookInfo').select('*').execute().data)
members = pd.DataFrame(supabase.table('Members').select('*').execute().data)
