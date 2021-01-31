import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../api"

import { User } from "../../types/User"

interface UserState
{
  loading : boolean
  error : boolean
  user : User | null
}

const initialState : UserState = {
  loading : false,
  error : false,
  user : null
}

export const requestUser = createAsyncThunk(
  'user/request',
  async (userId : number) => {
    const user = await api.getUser(userId)
    if(user) return user

    const res = await api.registerUser(userId)
    return res
  }
)

const userSlice = createSlice({
  name : 'user',
  initialState,
  reducers : {
    addPrediction(state,action)
    {
      state.user!.predictions.push(action.payload)
    },
  },
  extraReducers(builder)
  {
    builder
      .addCase(requestUser.pending, state => {
        state.loading = true
        state.error = false
      })
      .addCase(requestUser.rejected, state => {
        state.loading = false
        state.error = true
      })
      .addCase(requestUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
        state.user = action.payload
      })
  },
})

export const { addPrediction } = userSlice.actions
export default userSlice.reducer