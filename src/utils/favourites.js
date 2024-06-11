import { getStore } from './storage';
const {
    create,
    read,
    remove,
    fetchAll,
    deleteAll
} = getStore('cbreFavourites');

export function addFavourite(id) {
    create(id);
}

export function checkFavourite(id) {
    return read(id);
}

export function removeFavourite(id) {
    remove(id);
}

export function fetchAllFavourites() {
    return fetchAll();
}

export function deleteAllFavourites() {
    return deleteAll();
}
