import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {supabase} from '../utils/SupabaseClient.js'

const initialState = {
    data: []
}

// This is what supabase returns:
// const response = {
//   data: [ ... the rows you asked for ... ],
//   error: null,
//   status: 200,
//   statusText: "OK"
// };

//Can do response.data or response.error, or shortcut this if you only want data and error:

//thunkAPI is passed as param so that the function rejectWithValue can be accessed. But the user's params always come first,
//so if the user has no params, must use a placeholder _.
export const fetchBookInfo = createAsyncThunk('booksThunk', async(_, thunkAPI) => {
    const { data, error } = await supabase.from('BookInfo').select('*');
    if(error) {
        console.log(error)
        return thunkAPI.rejectWithValue(error.message)
    } else {
        return data;
    }
})
const bookSlice = createSlice({
    name: 'books',
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchBookInfo.fulfilled, (state, action) =>{
            state.data = action.payload
        })
    },
    reducers: {
        addBook: (state, action) => {
            const index = state.data.findIndex(row => row.id === action.payload.id);
            if(index != -1)
            {
                state.data[index] = (action.payload)
            } else {
                state.data.push(action.payload);
            }
        }
    }
})

export const {addBook} = bookSlice.actions
export default bookSlice


