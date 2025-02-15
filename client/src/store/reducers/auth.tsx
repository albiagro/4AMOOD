import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import api from "../../axios";


export type SliceState = { isLoading: boolean; currentUser?: string | null};

const initialState: SliceState = { isLoading: false };

type ReturnedType = any // The type of the return of the thunk
type ThunkArgRegistration = { name: string, surname: string, sex: string,  birthday: string, username: string, password: string, email: string } 
type ThunkArgUpdateData = { username: string, name: string, surname: string, password: string, email: string } 
type ThunkArgLogin = { username: string, password: string} 

export const register = createAsyncThunk<ReturnedType, ThunkArgRegistration>('auth/register', async (userData, thunkAPI) => {
        
    try {
        const response = await api.post('/users', {
            ...userData,
        })
        return response.data
    } catch (error : any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const updateUser = createAsyncThunk<ReturnedType, ThunkArgUpdateData>('auth/update', async (userData, thunkAPI) => {
        
    try {
        const response = await api.put('/users', {
            ...userData,
        })
        return response.data
    } catch (error : any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const login = createAsyncThunk<ReturnedType, ThunkArgLogin>('auth/login', async (userData, thunkAPI) => {
        
    try {
        const response = await api.post('/users/login', {
            ...userData,
        })
        return response.data
    } catch (error : any) {
        return thunkAPI.rejectWithValue(error.response.data.message)        
    }
})

export const getCurrentUser = createAsyncThunk<any, void>('auth/getCurrentUser', async (_, thunkAPI) => {
        
    try {
        const token = localStorage.getItem('accessToken') ?? ''
        const response = await api.get('/user', {
            headers : {
                Authorization: `Token ${token}`
            }
        })
        return response.data
    } catch (error : any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const logout = createAsyncThunk<any, void>('auth/logout', async () => {
        
    localStorage.removeItem("accessToken")
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload
    })
    .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
    })
    .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload
    })
    .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
    })
    .addCase(login.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload
    })
    .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
    })
    .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload
    })
    .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
    })
    .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
    })
  }
});


export default authSlice.reducer;