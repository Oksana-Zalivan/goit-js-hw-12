import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
    event.preventDefault();

    const newQuery = event.target.elements['search-text'].value.trim();

    if (!newQuery) {
    iziToast.warning({
        title: 'Увага',
        message: 'Введи, будь ласка, пошуковий запит 🙂',
        position: 'topRight',
    });
    return;
    }

    searchQuery = newQuery;
    page = 1;
    totalHits = 0;

    clearGallery();
    hideLoadMoreButton();

    await fetchImages({ isNewSearch: true });

    form.reset();
}

async function onLoadMore() {
    await fetchImages({ isNewSearch: false });
}

async function fetchImages({ isNewSearch }) {
    showLoader();
    hideLoadMoreButton();

    try {
        const data = await getImagesByQuery(searchQuery, page);
        const { hits, totalHits: apiTotalHits } = data;

    if (isNewSearch) {
        if (!hits.length) {
            clearGallery();
            iziToast.info({
                title: 'Нічого не знайдено',
                message: 'Спробуй інший запит 😉',
                position: 'topRight',
            });
            return;
        }

        totalHits = apiTotalHits;
    }

    if (!hits.length) {
        hideLoadMoreButton();
        iziToast.info({
            title: 'Упс',
            message: "We're sorry, but you've reached the end of search results.",
            position: 'topRight',
        });
        return;
    }

    createGallery(hits);

    if (page > 1) {
        smoothScrollGallery();
    }

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (page < totalPages) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton();
        iziToast.info({
            title: 'Кінець колекції',
            message: "We're sorry, but you've reached the end of search results.",
            position: 'topRight',
        });
    }

    page += 1;
    } catch (error) {
        iziToast.error({
            title: 'Помилка',
            message:
            'Сталася помилка під час завантаження. Спробуй ще раз пізніше.',
        position: 'topRight',
        });
    } finally {
    hideLoader();
    }
}

function smoothScrollGallery() {
    const firstCard = document.querySelector('.gallery-item');
    if (!firstCard) return;

    const { height: cardHeight } = firstCard.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}
