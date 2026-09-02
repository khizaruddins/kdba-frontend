'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { mediaApi } from '@/lib/api/media';
import { MediaItem } from '@/types';
import { Upload, Image as ImageIcon, Copy, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MediaPanel() {
  const { activePageId, activeSectionId, updateSectionConfig } = useEditorStore();
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const loadMedia = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mediaApi.getAll();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await mediaApi.upload(file);
      await loadMedia();
    } catch (err) {
      console.error('Failed to upload media:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyToSection = (url: string) => {
    if (!activePageId || !activeSectionId) {
      setFeedback('Select a section on canvas first!');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    const fullUrl = url.startsWith('http') ? url : `http://localhost:4000${url}`;
    updateSectionConfig(activePageId, activeSectionId, { imageUrl: fullUrl });
    setFeedback('Applied image to section!');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleCopy = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `http://localhost:4000${url}`;
    navigator.clipboard.writeText(fullUrl);
    setFeedback('URL Copied to clipboard!');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Media Library
          </h3>
          <p className="text-[11px] text-slate-500">
            Upload & insert visual assets
          </p>
        </div>

        <label className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 cursor-pointer">
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {feedback && (
        <div className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 p-2 text-center text-xs font-semibold text-indigo-300">
          {feedback}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-36 items-center justify-center text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500 mr-2" />
          <span className="text-xs">Loading media assets...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs font-semibold text-slate-300">
            No media uploaded yet
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Upload images, banners, and logos above.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {mediaList.map((media) => {
            const fileUrl = media.url.startsWith('http')
              ? media.url
              : `http://localhost:4000${media.url}`;

            return (
              <div
                key={media.id}
                className="group rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 flex flex-col gap-2 hover:border-slate-700 transition-all"
              >
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={fileUrl}
                    alt={media.altText || media.filename}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                    {media.filename}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {(media.size / 1024).toFixed(0)} KB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyToSection(fileUrl)}
                    className="text-[11px] h-7 px-1.5"
                  >
                    Insert to Section
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(fileUrl)}
                    leftIcon={<Copy className="h-3 w-3" />}
                    className="text-[11px] h-7 px-1.5"
                  >
                    Copy Link
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
