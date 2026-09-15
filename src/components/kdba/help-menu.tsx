'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

export function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Help"
      description="Shortcuts and where to go next."
      maxWidth="md"
    >
      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-2 font-medium">Workspace</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <span className="ml-2">Command menu</span>
            </li>
            <li>Create a site from Templates, then open it in the visual editor.</li>
            <li>Form submissions appear under Forms.</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-medium">Editor</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
              <span className="ml-2">Save</span>
            </li>
            <li>
              <Kbd>⌘</Kbd>
              <Kbd>Z</Kbd>
              <span className="ml-2">Undo</span>
            </li>
            <li>
              <Kbd>Esc</Kbd>
              <span className="ml-2">Clear selection</span>
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
}

export function HelpMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="ghost" size="icon-sm" aria-label="Help" onClick={() => setOpen(true)}>
        <HelpCircle />
      </Button>
      <HelpDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
