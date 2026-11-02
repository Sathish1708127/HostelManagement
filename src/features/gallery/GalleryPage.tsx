import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../app/providers';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import {
  deleteGalleryPhoto,
  listGalleryPhotos,
  saveGalleryPhoto,
  type GalleryPhoto,
} from './galleryStore';

type GalleryPhotoView = GalleryPhoto & { url: string };

export default function GalleryPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhotoView[]>([]);
  const photoUrls = useRef(new Set<string>());
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function refreshPhotos() {
    setLoading(true);
    try {
      const saved = await listGalleryPhotos();
      setPhotos((current) => {
        current.forEach((photo) => {
          URL.revokeObjectURL(photo.url);
          photoUrls.current.delete(photo.url);
        });
        return saved.map((photo) => {
          const url = URL.createObjectURL(photo.image);
          photoUrls.current.add(url);
          return { ...photo, url };
        });
      });
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load gallery photos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const urls = photoUrls.current;
    void refreshPhotos();
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setError('');
  }

  async function addPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !caption.trim() || !user) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError('Photos must be 6 MB or smaller.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await saveGalleryPhoto({
        id: crypto.randomUUID(),
        caption: caption.trim(),
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.name,
        image: file,
      });
      setCaption('');
      setFile(null);
      event.currentTarget.reset();
      setMessage('Photo added to the hostel gallery.');
      await refreshPhotos();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save the photo.');
    } finally {
      setSaving(false);
    }
  }

  async function removePhoto(photo: GalleryPhotoView) {
    try {
      await deleteGalleryPhoto(photo.id);
      setPhotos((current) => {
        URL.revokeObjectURL(photo.url);
        photoUrls.current.delete(photo.url);
        return current.filter((item) => item.id !== photo.id);
      });
      setMessage('Photo removed from the gallery.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to remove the photo.');
    }
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Gallery' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Hostel life</p>
          <h1>Hostel gallery</h1>
          <p>Share moments from rooms, events, and the community. Photos stay on this device.</p>
        </div>
      </section>
      {message && <p className="gallery-message" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      <form className="panel gallery-upload" onSubmit={(event) => void addPhoto(event)}>
        <div>
          <h2>Share a photo</h2>
          <p className="muted">Images up to 6 MB. Add a short caption to help others find the moment.</p>
        </div>
        <label className="gallery-file-input">Photo<input type="file" accept="image/*" required onChange={chooseFile} /></label>
        <input className="styled-input" required maxLength={120} placeholder="Photo caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
        <button className="primary-button" type="submit" disabled={!file || saving}>{saving ? 'Adding photo...' : 'Add to gallery'}</button>
      </form>

      <section className="gallery-grid" aria-label="Hostel photos">
        {loading ? <p className="muted">Loading gallery...</p> : photos.map((photo) => (
          <article className="gallery-card" key={photo.id}>
            <img src={photo.url} alt={photo.caption} loading="lazy" />
            <div className="gallery-caption">
              <div><strong>{photo.caption}</strong><small>Shared by {photo.uploadedBy} · {new Date(photo.uploadedAt).toLocaleDateString()}</small></div>
              {photo.uploadedBy === user?.name && <button className="row-action" type="button" onClick={() => void removePhoto(photo)} aria-label={`Remove ${photo.caption}`}>Remove</button>}
            </div>
          </article>
        ))}
        {!loading && photos.length === 0 && <div className="panel gallery-empty"><span aria-hidden="true">▧</span><h2>The gallery is ready for its first photo</h2><p className="muted">Add a photo above to start sharing hostel memories.</p></div>}
      </section>
    </main>
  );
}
