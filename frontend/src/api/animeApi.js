import axios from 'axios';

const API_BASE_URL = 'https://api.jikan.moe/v4';
const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.response.use(
    response => response,
    async error => {
        if(error.response && error.response.status === 429) {
            await delay(1000);
            return api.request(error.config);
        }
        return Promise.reject(error);
    }
);

export const fetchTrendingCharacters = async (page = 1, limit = 10) => {
    await delay(300);
    const res = await api.get('/characters', {
        params: {
            page,
            limit,
            order_by: 'favorites',
            sort: 'desc'
        },
    });
    return res.data;
};

export const fetchTrendingAnime = async (page = 1, limit = 10) => {
    await delay(300);
    const res = await api.get('/top/anime', {
        params: {
            page,
            limit,
        },
    });
    return res.data;
};

export const searchCharacters = async (query, page = 1, limit = 10) => {
    await delay(300);
    const res = await api.get('/characters', {
        params: {
            page,
            limit,
            q: query,
        },
    });
    return res.data;
};

export const searchAnime = async (query, page = 1, limit = 10) => {
    await delay(300);
    const res = await api.get('/anime', {
        params: {
            page,
            limit,
            q: query,
        },
    });
    return res.data;
};

export const getCharacterById = async (id) => {
    await delay(300);
    const res = await api.get(`/characters/${id}`);
    return res.data;
};

export const getCharacterVoiceActors = async (id) => {
    await delay(300);
    const res = await api.get(`/characters/${id}/voices`);
    return res.data;
};

export const getCharacterAnime = async (id) => {
    await delay(300);
    const res = await api.get(`/characters/${id}/anime`);
    return res.data;
};

export default {
    fetchTrendingAnime,
    fetchTrendingCharacters,
    searchCharacters,
    searchAnime,
    getCharacterById,
    getCharacterAnime,
    getCharacterVoiceActors
};
