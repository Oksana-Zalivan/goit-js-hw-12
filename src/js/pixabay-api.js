import axios from 'axios';

const API_KEY = '53371972-407ae4137ffe2ff2cf6f525d2';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
    const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page,
    };

    const response = await axios.get('/', { params });
    return response.data; 
}
