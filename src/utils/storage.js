import lockr from 'lockr';

export function create(storageKey, id) {
    lockr.sadd(storageKey, id);
}

export function read(storageKey, id) {
    return lockr.sismember(storageKey, id);
}

export function remove(storageKey, id) {
    lockr.srem(storageKey, id);
}

export function fetchAll(storageKey) {
    return lockr.smembers(storageKey);
}

export function deleteAll(storageKey) {
    lockr.rm(storageKey);
}

export function getStore(key) {
    return {
        create: create.bind(this, key),
        read: read.bind(this, key),
        remove: remove.bind(this, key),
        fetchAll: fetchAll.bind(this, key),
        deleteAll: deleteAll.bind(this, key)
    };
}
