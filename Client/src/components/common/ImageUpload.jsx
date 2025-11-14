import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess, label = 'Upload Image', accept = 'image/*' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

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
        setPreview(reader.result);
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
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image
        </label>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md border border-gray-300"
            />
            {uploadedUrl && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                Uploaded!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uploaded URL */}
      {uploadedUrl && (
        <div className="mb-4 p-3 bg-green-50 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uploaded URL:
          </label>
          <input
            type="text"
            value={uploadedUrl}
            readOnly
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
            onClick={(e) => e.target.select()}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(uploadedUrl);
              toast.success('URL copied to clipboard!');
            }}
            className="mt-2 text-sm text-green-600 hover:text-green-700"
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
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {(selectedFile || uploadedUrl) && (
          <button
            onClick={handleClear}
            disabled={uploading}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
          <p><strong>File Name:</strong> {selectedFile.name}</p>
          <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p><strong>File Type:</strong> {selectedFile.type}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;


