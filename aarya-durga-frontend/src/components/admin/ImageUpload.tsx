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

interface UploadGuideline {
  dimensions: string;
  maxSizeMb: number;
  formats: string;
}

const DEFAULT_GUIDELINE: UploadGuideline = {
  dimensions: '1200 x 800 px',
  maxSizeMb: 5,
  formats: 'JPG, JPEG, PNG, GIF',
};

const getUploadGuideline = (section?: string): UploadGuideline => {
  if (!section) return DEFAULT_GUIDELINE;

  if (section === 'favicon') {
    return {
      dimensions: '64 x 64 px',
      maxSizeMb: 5,
      formats: 'PNG',
    };
  }

  if (section === 'logo') {
    return {
      dimensions: '400 x 120 px',
      maxSizeMb: 5,
      formats: 'PNG, JPG',
    };
  }

  if (
    [
      'hero',
      'visit-section',
      'contact-hero',
      'events-gallery-hero',
      'pooja-donation-hero',
    ].includes(section)
  ) {
    return {
      dimensions: '1920 x 1080 px',
      maxSizeMb: 5,
      formats: 'JPG, JPEG, PNG',
    };
  }

  if (section === 'about-hero') {
    return {
      dimensions: '1200 x 1200 px',
      maxSizeMb: 5,
      formats: 'JPG, JPEG, PNG',
    };
  }

  if (section === 'origin') {
    return {
      dimensions: '1200 x 900 px',
      maxSizeMb: 5,
      formats: 'JPG, JPEG, PNG',
    };
  }

  if (/^event-\d+$/.test(section)) {
    return {
      dimensions: '1200 x 800 px',
      maxSizeMb: 5,
      formats: 'JPG, JPEG, PNG',
    };
  }

  if (/^gallery-\d+$/.test(section)) {
    return {
      dimensions: '1600 x 1200 px',
      maxSizeMb: 5,
      formats: 'JPG, JPEG, PNG',
    };
  }

  if (/^committee-member-\d+$/.test(section)) {
    return {
      dimensions: '600 x 600 px',
      maxSizeMb: 5,
      formats: 'JPG, JPEG, PNG',
    };
  }

  return DEFAULT_GUIDELINE;
};

export const ImageUpload = ({ onUpload, onRemove, mediaId, preview, existingImageUrl, section }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  const [existingImage, setExistingImage] = useState<string | undefined>(existingImageUrl);
  const uploadMutation = useUploadMedia();
  const guideline = getUploadGuideline(section);

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
    <div className="space-y-3">
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <p>
          Expected size: <span className="font-medium text-foreground">{guideline.dimensions}</span>
        </p>
        <p>
          Max file size: <span className="font-medium text-foreground">{guideline.maxSizeMb} MB</span>
        </p>
        <p>
          Format: <span className="font-medium text-foreground">{guideline.formats}</span>
        </p>
      </div>

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
              accept="image/png,image/jpeg,image/jpg,image/gif"
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
    </div>
  );
};
