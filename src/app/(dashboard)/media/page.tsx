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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';

export default function MediaPage() {
  const { confirm, dialog } = useConfirm();
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

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this file?',
      description: 'The asset will be removed from your library. Pages that still reference it may show a broken image.',
      confirmLabel: 'Delete file',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/media/${id}`);
        toast.success('File deleted');
        await loadMedia();
      },
    });
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
    <div className="flex-1 space-y-6">
      {dialog}
      <PageHeader
        title="Media library"
        description="Upload and organize images used across websites and product catalogs."
        actions={
          <Button size="sm" onClick={() => setIsUploadOpen(true)}>
            <Upload />
            Upload
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-col justify-between">
              <Skeleton className="h-36 w-full rounded-none" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-8 w-8 text-muted-foreground" />}
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
                className="overflow-hidden group flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="relative h-36 w-full bg-muted overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={media.altText || media.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <File className="h-10 w-10 text-muted-foreground/50" />
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => copyUrl(media.id, media.url)}
                      title="Copy URL"
                    >
                      {copiedId === media.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(media.id)}
                      title="Delete asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 border-t bg-card">
                  <p className="text-xs font-medium truncate" title={media.filename}>
                    {media.filename}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
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
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <input
              type="file"
              required
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
              className="text-xs text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {selectedFile && (
              <p className="mt-2 text-xs font-medium text-emerald-500">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isUploading} disabled={!selectedFile}>
              Upload Asset
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
