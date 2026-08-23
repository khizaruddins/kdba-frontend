'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { MediaItem } from '@/types';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  File,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';

export default function MediaPage() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Upload dialog
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [altText, setAltText] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const loadMedia = async () => {
    try {
      const data: any = await apiClient.get('/media');
      setMediaList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (altText) formData.append('altText', altText);

    try {
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsUploadOpen(false);
      setSelectedFile(null);
      setAltText('');
      loadMedia();
    } catch (err) {
      console.error('Failed to upload file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      await apiClient.delete(`/media/${id}`);
      loadMedia();
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const copyUrl = (id: string, url: string) => {
    const fullUrl = url.startsWith('http')
      ? url
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Media Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload and organize logos, product photography, and marketing images
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsUploadOpen(true)}
          leftIcon={<Upload className="h-4 w-4" />}
        >
          Upload Media
        </Button>
      </div>

      {mediaList.length === 0 && !isLoading ? (
        <EmptyState
          icon={<ImageIcon className="h-6 w-6 text-purple-400" />}
          title="No media assets uploaded yet"
          description="Upload brand logos, hero banners, and photography to use in your website editor."
          actionLabel="Upload First Asset"
          onAction={() => setIsUploadOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((media) => {
            const isImage = media.mimeType.startsWith('image/');
            const fileUrl = media.url.startsWith('http')
              ? media.url
              : `http://localhost:4000${media.url}`;

            return (
              <Card
                key={media.id}
                className="overflow-hidden card-hover group flex flex-col justify-between"
              >
                <div className="relative h-36 w-full bg-slate-800 overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={media.altText || media.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <File className="h-10 w-10 text-slate-500" />
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyUrl(media.id, media.url)}
                      className="rounded-lg bg-slate-800 p-2 text-slate-200 hover:bg-slate-700 hover:text-white"
                      title="Copy URL"
                    >
                      {copiedId === media.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(media.id)}
                      className="rounded-lg bg-slate-800 p-2 text-rose-400 hover:bg-rose-600 hover:text-white"
                      title="Delete asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-white truncate">
                    {media.filename}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {(media.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Media Asset"
        description="Select an image or asset from your device."
      >
        <form onSubmit={handleUpload} className="space-y-4 pt-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-8 text-center">
            <Upload className="h-8 w-8 text-slate-400 mb-2" />
            <input
              type="file"
              required
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
              className="text-xs text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
            {selectedFile && (
              <p className="mt-2 text-xs font-medium text-emerald-400">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isUploading}
              disabled={!selectedFile}
            >
              Upload Asset
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
