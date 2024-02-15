// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    email: '',
    joining: '',
  },
  reducers: {
    setUserData: (state, action) => {
      const { id, name, email, joining } = action.payload;
      state.id = id;
      state.name = name;
      state.email = email;
      state.joining = joining;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
