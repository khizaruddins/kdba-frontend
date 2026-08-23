'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { MediaItem } from '@/types';
import { Dialog } from './dialog';
import { Button } from './button';
import { Image as ImageIcon, Upload, Check, Loader2, Plus } from 'lucide-react';

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const loadMedia = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data: any = await apiClient.get('/media');
      setMediaList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load media items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, loadMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res: any = await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadMedia();
      if (res && res.url) {
        const fullUrl = res.url.startsWith('http')
          ? res.url
          : `http://localhost:4000${res.url}`;
        onSelect(fullUrl);
        onClose();
      }
    } catch (err) {
      console.error('Failed to upload file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectMedia = (media: MediaItem) => {
    const fullUrl = media.url.startsWith('http')
      ? media.url
      : `http://localhost:4000${media.url}`;
    onSelect(fullUrl);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Media Image"
      description="Select an asset from your Media Library or upload a new image."
    >
      <div className="space-y-4 pt-2">
        {/* Upload Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs text-slate-400">
            {mediaList.length} assets available
          </span>
          <label className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 cursor-pointer">
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload New'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mr-2" />
            <span className="text-xs">Loading media...</span>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <ImageIcon className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-xs font-semibold text-slate-300">
              No media assets found
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Upload a logo or image above to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
            {mediaList.map((media) => {
              const fileUrl = media.url.startsWith('http')
                ? media.url
                : `http://localhost:4000${media.url}`;

              return (
                <div
                  key={media.id}
                  onClick={() => handleSelectMedia(media)}
                  className="group relative h-24 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/50 transition-all flex flex-col justify-end"
                >
                  <img
                    src={fileUrl}
                    alt={media.altText || media.filename}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                      Select
                    </span>
                  </div>
                  <div className="relative z-10 bg-slate-950/80 p-1 text-[9px] text-slate-300 truncate">
                    {media.filename}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
