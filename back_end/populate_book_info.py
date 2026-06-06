from back_end.app import pull_book_info


for i in range(len(book_info)):
    title = book_info['Book'][i]
    print(title)
    print(str(i) + ' of ' + str(len(book_info) - 1))
    author = book_info['Author'][i]

    book_info = pull_book_info(title, author, all_matches = True, strict = True)

#just to update existing books and add only google rating and thumbnail:
    if book_info:
        googlebooks_data_to_write = pd.DataFrame([{
            'id': book_info['id'][i],
            'avg_google_rating': float(book_info['avgGoogleRating']) if book_info.get('avgGoogleRating') else None,
            'num_google_rating': int(book_info['numGoogleRating']) if book_info.get('numGoogleRating') else None,
            'thumbnail_url': book_info['thumbnail']
        }]
        )