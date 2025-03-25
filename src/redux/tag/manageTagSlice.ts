import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTagsThunk } from "./manageTagThunk";
import { TagInfo } from "common/models";

// --------------------
// 1. Define createAsyncThunk
// --------------------
export const getAllTags = createAsyncThunk("Tag/getAllTags", getAllTagsThunk);

// --------------------
// 2. Define State interface
// --------------------
interface TagState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  tags: TagInfo[];
  tag: TagInfo | null;
  totalRecord: number;
  totalPage: number;
  pageIndex: number;
}

// --------------------
// 3. Initialize initialState
// --------------------
const initialState: TagState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  tags: [],
  tag: null,
  totalRecord: 0,
  totalPage: 0,
  pageIndex: 1,
};

// --------------------
// 4. Create Slice
// --------------------
const tagSlice = createSlice({
  name: "Tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllTags
    builder
      .addCase(getAllTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tags = action.payload?.data || [];
        state.totalRecord = action.payload?.totalRecord || 0;
        state.totalPage = action.payload?.totalPage || 0;
        state.pageIndex = action.payload?.pageIndex || 1;
      })
      .addCase(getAllTags.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

// --------------------
// 5. Export reducer
// --------------------
const tagReducer = tagSlice.reducer;
export default tagReducer;
