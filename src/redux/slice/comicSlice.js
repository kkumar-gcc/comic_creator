import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    comics: [],
    nextComicId: 1,
};

const comicSlice = createSlice({
    name: "comic",
    initialState,
    reducers: {
        setComics: (state, action) => {
            state.comics = action.payload;
        },
        appendComic: (state, action) => {
            const { text, image, time } = action.payload;
            state.comics.push({ id: state.nextComicId, text, image, time });
            state.nextComicId++;
        },
        removeComic: (state, action) => {
            const comicIdToRemove = action.payload;
            state.comics = state.comics.filter(comic => comic.id !== comicIdToRemove);
        },
    }
});

export const { setComics, appendComic, removeComic } = comicSlice.actions;

export default comicSlice.reducer;
