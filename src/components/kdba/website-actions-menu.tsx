'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy, ExternalLink, MoreHorizontal, Pencil, PencilLine, Rocket, Settings, Trash2 } from 'lucide-react';
import { websitesApi } from '@/lib/api/websites';
import { WebsiteStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/components/kdba/confirm-dialog';

export type WebsiteActionTarget = {
  id: string;
  name: string;
  slug: string;
  status: WebsiteStatus;
};

export function WebsiteActionsMenu({
  website,
  tenantSlug,
  onChanged,
}: {
  website: WebsiteActionTarget;
  tenantSlug?: string;
  onChanged?: () => void;
}) {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const liveHref = `/site/${tenantSlug || website.slug}`;
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(website.name);

  React.useEffect(() => {
    setRenameValue(website.name);
  }, [website.name]);

  const handleRename = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = renameValue.trim();
    if (!name || name === website.name) {
      setRenameOpen(false);
      return;
    }
    try {
      await websitesApi.update(website.id, { name });
      toast.success('Website renamed');
      setRenameOpen(false);
      onChanged?.();
    } catch {
      toast.error('Could not rename website');
    }
  };

  const handleDuplicate = async () => {
    try {
      const copy = await websitesApi.duplicate(website.id, { name: `${website.name} copy` });
      toast.success('Website duplicated');
      onChanged?.();
      if (copy?.id) router.push(`/editor/${copy.id}`);
    } catch {
      toast.error('Could not duplicate website');
    }
  };

  const handlePublish = async () => {
    try {
      if (website.status === 'PUBLISHED') {
        await websitesApi.unpublish(website.id);
        toast.success('Website unpublished');
      } else {
        await websitesApi.publish(website.id);
        toast.success('Website published');
      }
      onChanged?.();
    } catch {
      toast.error('Could not update publish state');
    }
  };

  const handleDelete = () => {
    confirm({
      title: `Delete ${website.name}?`,
      description: 'This cannot be undone. The site and its published version will be removed.',
      confirmLabel: 'Delete website',
      destructive: true,
      onConfirm: async () => {
        await websitesApi.delete(website.id);
        toast.success('Website deleted');
        onChanged?.();
      },
    });
  };

  return (
    <>
      {dialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label={`${website.name} actions`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/editor/${website.id}`}>
              <Pencil />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={liveHref} target="_blank" rel="noreferrer">
              <ExternalLink />
              Preview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handlePublish()}>
            <Rocket />
            {website.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <PencilLine />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleDuplicate()}>
            <Copy />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        isOpen={renameOpen}
        onClose={() => setRenameOpen(false)}
        title="Rename website"
        description="This name appears in the dashboard, editor, and published site metadata."
      >
        <form onSubmit={(event) => void handleRename(event)} className="space-y-4">
          <Input
            label="Website name"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save name
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
