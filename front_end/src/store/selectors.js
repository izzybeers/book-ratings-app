import { createSelector } from '@reduxjs/toolkit';

const selectBooks = (state) => state.books.data;
const selectRatings = (state) => state.ratings.data;
const selectMembers = (state) => state.members.data;

export const selectJoinedTable = createSelector(
  [selectBooks, selectRatings, selectMembers],
  (books, ratings, members) => {
    if (!books || !ratings || !members) return [];
    if (!books.length || !ratings.length || !members.length) return [];

    return ratings.map((rating) => {
      const book = books.find((b) => b.id == rating.bookid);
      const member = members.find((m) => m.MemberID == rating.memberid);
      return {
        ...rating,
        Book: book?.Book,
        Author: book?.Author,
        Year: book?.Year,
        BookSelector: book?.BookSelector,
        Age: book?.Age,
        Member: member?.MemberName,
        Thumbnail: book?.thumbnail_url,
        PrimaryGenre: book?.PrimaryGenre,
        SecondaryGenres: book?.SecondaryGenres,
        WordCount: book?.WordCount
      };
    });
  }

);

