export type GalleryPhoto = {
  id: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
  image: Blob;
};

const databaseName = 'hostel-pulse-gallery';
const storeName = 'photos';

function openGalleryDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open the gallery.'));
  });
}

export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  const database = await openGalleryDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).getAll() as IDBRequest<GalleryPhoto[]>;
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
    request.onerror = () => reject(request.error ?? new Error('Unable to load gallery photos.'));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to load gallery photos.'));
  });
}

export async function saveGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  const database = await openGalleryDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(photo);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to save the photo.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Unable to save the photo.'));
  });
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const database = await openGalleryDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).delete(id);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Unable to remove the photo.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Unable to remove the photo.'));
  });
}
