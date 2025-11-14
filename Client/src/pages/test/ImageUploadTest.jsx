import { useState } from 'react';
import ImageUpload from '../../components/common/ImageUpload';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const ImageUploadTest = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUploadSuccess = (url) => {
    setUploadedImages([...uploadedImages, url]);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Image Upload Test</h1>

        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Select an image file (PNG, JPG, GIF up to 5MB)</li>
            <li>Preview will be shown before uploading</li>
            <li>Click "Upload Image" to upload to Cloudinary</li>
            <li>Copy the uploaded URL to use in your application</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <ImageUpload
              label="Test Image Upload"
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          {/* Uploaded Images History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
            {uploadedImages.length === 0 ? (
              <p className="text-gray-500">No images uploaded yet</p>
            ) : (
              <div className="space-y-4">
                {uploadedImages.map((url, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                        onClick={(e) => e.target.select()}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          alert('URL copied!');
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Endpoint Info */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Note:</h3>
          <p className="text-sm text-gray-700">
            This test page uses the <code className="bg-yellow-100 px-1 rounded">/api/upload</code> endpoint.
            Make sure your server has this route configured for image uploads.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ImageUploadTest;


