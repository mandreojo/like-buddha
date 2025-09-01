'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleReset = () => {
    setPreview(null);
  };

  if (preview) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="relative">
          <img
            src={preview}
            alt="업로드된 이미지"
            className="w-full h-48 object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
                            <p className="text-center text-gray-600 mt-3 text-sm">
                      {t('analyzing')}
                    </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Upload className="w-6 h-6 text-orange-600" />
            </div>
          </div>
                                <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {t('uploadTitle')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {t('uploadDesc')}
                        </p>
                      </div>
                      <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm">
                        <Camera className="w-4 h-4 inline mr-2" />
                        {t('selectPhoto')}
                      </button>
        </div>
      </div>
    </div>
  );
}
