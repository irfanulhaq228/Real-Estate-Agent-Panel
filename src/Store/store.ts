import { configureStore } from "@reduxjs/toolkit";
import { featuresReducer } from "../Features/Features";

export const store = configureStore({
    reducer: featuresReducer
});