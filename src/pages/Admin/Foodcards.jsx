import React, { useRef, useState } from 'react'
import './AdminMess.css'

export function Foodcards({ name = '', image = '', description = '' }) {
  const [imgSrc, setImgSrc] = useState(image || '')
  const [title, setTitle] = useState(name)
  const [desc, setDesc] = useState(description)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    // optional: limit size to 2MB
    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert('Image is too large (max 2MB)')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)
  }

  const handleRemove = (e) => {
    e && e.preventDefault()
    setImgSrc('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openFilePicker = () => fileInputRef.current && fileInputRef.current.click()

  const onKeyPressImage = (e) => {
    if (e.key === 'Enter' || e.key === ' ') openFilePicker()
  }

  return (
    <div className="container">
      <h4>hi</h4>
      <div className="card">
        <div
          className="card-image-wrapper"
          onClick={openFilePicker}
          role="button"
          tabIndex={0}
          onKeyDown={onKeyPressImage}
          aria-label="Upload food image"
          style={{ cursor: 'pointer' }}
        >
          {imgSrc ? (
            <img src={imgSrc} className="card-img-top" alt="uploaded food" />
          ) : (
            <div className="image-placeholder">Click to upload image</div>
          )}
        </div>

        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="card-body1">
          <div className="card-body">
            <h5 className="card-title">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </h5>
            <p className="card-text">
              <input
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </p>
          </div>

          <div className="announcebtn" style={{ marginTop: 8 }}>
            {imgSrc && (
              <button className="bttn btn11" onClick={handleRemove} type="button">Remove</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
