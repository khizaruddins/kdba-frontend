'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import { Image as ImageIcon } from 'lucide-react';

export function BusinessPanel() {
  const { website, updateBusiness } = useEditorStore();
  const [logoPickerOpen, setLogoPickerOpen] = React.useState(false);

  if (!website) return null;
  const business = website.business || {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Business Information
        </h3>
        <p className="text-[11px] text-slate-500">
          Central details used across navbar, footer, and contact sections.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <Input
          label="Business / Brand Name"
          value={business.name || ''}
          onChange={(e) => updateBusiness({ name: e.target.value })}
          placeholder="Apex Advisory"
        />

        <Input
          label="Tagline"
          value={business.tagline || ''}
          onChange={(e) => updateBusiness({ tagline: e.target.value })}
          placeholder="Enterprise Strategy & Growth"
        />

        <Textarea
          label="Business Summary"
          rows={3}
          value={business.description || ''}
          onChange={(e) => updateBusiness({ description: e.target.value })}
          placeholder="Brief description of your business mission..."
        />

        {/* Logo Image */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300">
              Logo Image URL
            </label>
            <button
              type="button"
              onClick={() => setLogoPickerOpen(true)}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Choose from Media
            </button>
          </div>
          <Input
            value={business.logoUrl || ''}
            onChange={(e) => updateBusiness({ logoUrl: e.target.value })}
            placeholder="https://... or upload"
            leftIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
          />
          {business.logoUrl && (
            <div className="mt-2 h-14 w-auto max-w-[160px] p-2 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center">
              <img
                src={business.logoUrl}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <h4 className="font-semibold text-slate-300">Contact Channels</h4>

          <Input
            label="Direct Email"
            value={business.email || ''}
            onChange={(e) => updateBusiness({ email: e.target.value })}
            placeholder="hello@business.com"
          />

          <Input
            label="Phone Number"
            value={business.phone || ''}
            onChange={(e) => updateBusiness({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="WhatsApp Number (with country code)"
            value={business.whatsapp || ''}
            onChange={(e) => updateBusiness({ whatsapp: e.target.value })}
            placeholder="+15550000000"
          />

          <Input
            label="Physical Address"
            value={business.address || ''}
            onChange={(e) => updateBusiness({ address: e.target.value })}
            placeholder="100 Main Street, Suite 400"
          />
        </div>
      </div>

      <MediaPickerModal
        isOpen={logoPickerOpen}
        onClose={() => setLogoPickerOpen(false)}
        onSelect={(url) => updateBusiness({ logoUrl: url })}
      />
    </div>
  );
}
