import React from 'react';
import {configureStore} from '@reduxjs/toolkit'
import membersSlice from './membersSlice.js'
import bookSlice from './bookSlice.js'
import ratingsSlice from './ratingSlice.js';

export const store = configureStore({
    reducer: {
      members: membersSlice.reducer,
      books: bookSlice.reducer,
      ratings: ratingsSlice.reducer
    }
})