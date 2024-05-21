import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as tasksApi from "store/api/tasks";
import { errorMessages } from "helpers/errorMessages";
import { logout, sessionExpired } from "store/slices/authSlice";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  editing: null,
};

const apiThunk = (type, request) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg);
    } catch (error) {
      return rejectWithValue(errorMessages(error));
    }
  });

export const fetchTasks = apiThunk("tasks/fetchAll", async () => {
  const response = await tasksApi.getTasks();
  return (response.data?.data ?? []).map(({ attributes }) => attributes);
});

export const fetchTask = apiThunk("tasks/fetchOne", async (id) => {
  const response = await tasksApi.getTask(id);
  return response.data?.data?.attributes ?? null;
});

export const saveTask = apiThunk("tasks/save", async ({ id, task }) => {
  const response = id
    ? await tasksApi.updateTask(id, { task })
    : await tasksApi.createTask({ task });
  return response.data?.data?.attributes ?? null;
});

export const removeTask = apiThunk("tasks/remove", async (id) => {
  await tasksApi.deleteTask(id);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    editCleared: (state) => {
      state.editing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchTasks.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? null;
      })
      .addCase(fetchTask.fulfilled, (state, { payload }) => {
        state.editing = payload;
      })
      .addCase(removeTask.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((task) => task.id !== payload);
        if (state.editing?.id === payload) state.editing = null;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const { editCleared } = tasksSlice.actions;

export default tasksSlice.reducer;
