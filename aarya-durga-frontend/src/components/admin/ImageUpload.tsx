import { useState, useCallback, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadMedia } from '@/hooks/content/useMedia';
import client from '@/api/client';

interface ImageUploadProps {
  onUpload: (mediaId: number) => void;
  onRemove?: () => void;
  mediaId?: number;
  preview?: string;
  existingImageUrl?: string;
  section?: string;
}

export const ImageUpload = ({ onUpload, onRemove, mediaId, preview, existingImageUrl, section }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  const [existingImage, setExistingImage] = useState<string | undefined>(existingImageUrl);
  const uploadMutation = useUploadMedia();

  useEffect(() => {
    setPreviewUrl(preview);
    setExistingImage(existingImageUrl);
  }, [preview, existingImageUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    []
  );

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadMutation.mutate({ file, section }, {
      onSuccess: (response) => {
        onUpload(response.id);
      },
    });
  };

  return (
    <div
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {previewUrl || existingImage ? (
        <div className="relative">
          <img
            src={previewUrl || existingImage}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg"
          />
          <button
            onClick={() => {
              setPreviewUrl(undefined);
              setExistingImage(undefined);
              onRemove?.();
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
            title="Remove image"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Drag and drop your image here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};
