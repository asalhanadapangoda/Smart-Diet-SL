import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess, onImageChange, preview: externalPreview, label = 'Upload Image', accept = 'image/*' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(externalPreview || null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  // Update preview when external preview changes
  useEffect(() => {
    if (externalPreview) {
      setPreview(externalPreview);
    }
  }, [externalPreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setUploadedUrl(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result;
        setPreview(previewUrl);
        // If onImageChange is provided (EditProduct), call it
        if (onImageChange) {
          onImageChange(file, previewUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedUrl(data.url || data.imageUrl || data.path);
      toast.success('Image uploaded successfully!');
      
      if (onUploadSuccess) {
        onUploadSuccess(data.url || data.imageUrl || data.path);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadedUrl(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card rounded-2xl backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4 text-white text-glass">{label}</h3>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
          Select Image
        </label>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:glass-button file:text-white hover:file:scale-105 cursor-pointer"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-white/60 text-glass">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
            Preview
          </label>
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border-2 border-white/30"
            />
            {uploadedUrl && (
              <div className="absolute top-2 right-2 glass-button bg-green-500/40 text-white px-3 py-1 rounded-xl text-xs">
                Uploaded!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uploaded URL */}
      {uploadedUrl && (
        <div className="mb-4 p-3 glass-card bg-green-500/20 rounded-xl border border-green-300/30">
          <label className="block text-sm font-medium text-white/90 mb-1 text-glass">
            Uploaded URL:
          </label>
          <input
            type="text"
            value={uploadedUrl}
            readOnly
            className="glass-input w-full px-3 py-2 text-sm rounded-xl text-white"
            onClick={(e) => e.target.select()}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(uploadedUrl);
              toast.success('URL copied to clipboard!');
            }}
            className="mt-2 text-sm text-green-300 hover:text-green-200 transition-colors text-glass"
          >
            Copy URL
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="flex-1 glass-button text-white py-2 px-4 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {(selectedFile || uploadedUrl) && (
          <button
            onClick={handleClear}
            disabled={uploading}
            className="glass-button text-white py-2 px-4 rounded-xl hover:scale-105 transition-all font-medium bg-white/20"
          >
            Clear
          </button>
        )}
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="mt-4 p-3 glass-card bg-white/10 rounded-xl text-sm">
          <p className="text-white/90 text-glass"><strong>File Name:</strong> {selectedFile.name}</p>
          <p className="text-white/90 text-glass"><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p className="text-white/90 text-glass"><strong>File Type:</strong> {selectedFile.type}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;



