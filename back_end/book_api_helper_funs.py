import string
import re

tags_to_find = {
    'Fantasy': ['fantasy', 'fantasy fiction', 'magic'],
    'Sci-Fi': ['science fiction', 'sci fi', 'scifi'],
    'Thriller/Horror/Mystery/Suspense': ['thriller', 'thrillers', 'horror', 'horror fiction', 'suspense', 'mystery'],
    'Romance/Drama': ['romance', 'love', 'drama', 'interpersonal relations'],
    'Western': ['western', 'westerns'],
    'Historical': ['history', 'historial', 'histories']
}
# age_tags_to_find = {
#     'YA': ['young adult', 'young adult fiction', 'youth'],
#     ''
# }

def process_genre_tags(genre_tags):
    tag_flags = []
    for tag_category in tags_to_find.keys():
        print(tag_category)
        if any(item in genre_tags for item in tags_to_find.get(tag_category)):
            tag_flags.append(tag_category)
            

def process_googlebook(book_title, author, this_book_googlebooks_data, all_matches):
    translator = str.maketrans('', '', string.punctuation)
    check_validity = {
       'title_is_correct': [],
       'author_is_correct': [],
       'pagecount_populated': [],
       'description_populated': [],
       'year_populated': [],
       'google_ratings_populated': [],
       'has_thumbnail': []
    }
    for j in range(len(this_book_googlebooks_data['items'])):
        info = this_book_googlebooks_data['items'][j]['volumeInfo']
        print(j)
        check_validity['title_is_correct'].append(re.sub(r'\bthe\s+', '', info.get('title','').lower().strip().translate(translator)) == re.sub(r'\bthe\s', '', book_title.lower().strip().translate(translator)))
        if(info.get('authors')):
            check_authors = max([int(a.lower().strip().translate(translator) == author.lower().strip().translate(translator)) for a in info.get('authors')])
        else:
            check_authors = 0
        
        check_validity['author_is_correct'].append(check_authors == 1)
        check_validity['pagecount_populated'].append(info.get('pageCount', '') != '')
        check_validity['description_populated'].append(info.get('description', '') != '')
        check_validity['google_ratings_populated'].append(info.get('avgGoogleRating', '') != '')
        check_validity['has_thumbnail'].append(info.get('imageLinks', '') != '')
        
    print(check_validity)
    if all_matches == False | all_matches == 'False':
        valid_rows = [index for index in range(len((this_book_googlebooks_data['items']))) if check_validity['title_is_correct'][index] == True and 
                    check_validity['author_is_correct'][index] == True and check_validity['pagecount_populated'][index] == True
                    and  check_validity['description_populated'][index] == True
                    and check_validity['google_ratings_populated'][index] == True and check_validity['has_thumbnail'][index] == True]
        if(len(valid_rows) == 0):
            valid_rows = [index for index in range(len((this_book_googlebooks_data['items']))) if check_validity['title_is_correct'][index] == True and check_validity['pagecount_populated'][index] == True and
                    check_validity['author_is_correct'][index] == True and  check_validity['description_populated'][index] == True 
                    and check_validity['has_thumbnail'][index] == True]
            
        if(len(valid_rows) == 0):
            valid_rows = [index for index in range(len((this_book_googlebooks_data['items']))) if check_validity['title_is_correct'][index] == True and check_validity['pagecount_populated'][index] == True and
                    check_validity['author_is_correct'][index] == True and  check_validity['description_populated'][index] == True]
        if len(valid_rows) > 0:
            rows_to_run = valid_rows[:1]
        else:
            rows_to_run= []
    else:
        rows_to_run = range(len(this_book_googlebooks_data['items']))
    matches = []
    for r in rows_to_run:
        specific_info = this_book_googlebooks_data['items'][r]['volumeInfo']
        image_link = specific_info.get('imageLinks','')
        if image_link != '':
            thumbnail = image_link.get('thumbnail', '')
        else:
            thumbnail = ''
        authors = specific_info.get('authors', [])
        googlebooks_data = {
            'author': authors[0] if authors else 'Unknown Author',
            'title': specific_info.get('title', ''),
            'description': specific_info.get('description',''),
            'avgGoogleRating': specific_info.get('averageRating',''),
            'numGoogleRating': specific_info.get('ratingsCount',''),
            'maturityRating': specific_info.get('maturityRating',''),
            'thumbnail': thumbnail,
            'category': specific_info.get('categories', '')
        }
        matches.append(googlebooks_data)

    return matches
        
def process_openlibrary_data(book_title, this_book_openlibrary_data):
    for j in range(len(this_book_openlibrary_data['docs'])):
        info = this_book_openlibrary_data['docs'][j]
        # authors_openlibrary.append(info.get('author_name', ''))
        # titles_openlibrary.append(info.get('title', ''))
        if info.get('title').lower().strip() == book_title.lower().strip():
            all_tags_this_doc = info.get('subject', '')
            cleaned_tags_this_doc = []
            for tag in all_tags_this_doc:
                tag_split = tag.split(',')
                for subtag in tag_split:
                    cleaned_tags_this_doc.append(subtag.lower().translate(str.maketrans('', '', string.punctuation)).strip())
            if(len(cleaned_tags_this_doc) > 0):
                unique_tags = set(cleaned_tags_this_doc)
            relevant_tags_found = process_genre_tags(unique_tags)
            return {
                'title': book_title,
                'genre_tags': relevant_tags_found
            }



