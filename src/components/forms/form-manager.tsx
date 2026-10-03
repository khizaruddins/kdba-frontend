'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Inbox,
  Send,
  HelpCircle,
} from 'lucide-react';
import { CustomForm, CustomFormField, FormFieldType, DEFAULT_CONTACT_FORM } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/kdba/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuthStore } from '@/stores/auth-store';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { cmsFormsApi } from '@/lib/api/cms';
import Link from 'next/link';

const FIELD_TYPES: { value: FormFieldType; label: string; description: string }[] = [
  { value: 'text', label: 'Single-line Text', description: 'Names, subjects, short answers' },
  { value: 'email', label: 'Email Address', description: 'Validated email input' },
  { value: 'phone', label: 'Phone Number', description: 'Telephone numbers with formatting' },
  { value: 'textarea', label: 'Multi-line Text', description: 'Messages, inquiries, notes' },
  { value: 'select', label: 'Dropdown Select', description: 'Single choice from multiple options' },
  { value: 'checkbox', label: 'Single Checkbox', description: 'Consent, agreements, yes/no' },
];

export function FormManager() {
  const { tenant } = useAuthStore();
  const { websiteId } = useCmsWebsite();
  const storageKey = `kdba_forms_${tenant?.id || 'default'}`;

  const [forms, setForms] = React.useState<CustomForm[]>([]);
  const [selectedForm, setSelectedForm] = React.useState<CustomForm | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [fieldEditorOpen, setFieldEditorOpen] = React.useState(false);
  const [editingField, setEditingField] = React.useState<CustomFormField | null>(null);
  const [previewValues, setPreviewValues] = React.useState<Record<string, any>>({});
  const [previewSubmitted, setPreviewSubmitted] = React.useState(false);

  // Load forms on mount (from cmsFormsApi or localStorage)
  React.useEffect(() => {
    let loadedFromApi = false;
    if (websiteId) {
      void cmsFormsApi.list(websiteId).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          loadedFromApi = true;
          const mapped: CustomForm[] = res.map((f: any) => ({
            id: f.id,
            name: f.name,
            slug: f.slug,
            description: f.description || '',
            submitButtonText: f.settings?.submitButtonText || 'Submit Inquiry',
            successMessage: f.settings?.successMessage || 'Thank you! Your submission has been received.',
            enabled: f.isActive ?? true,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
            fields: Array.isArray(f.fields) && f.fields.length > 0 ? f.fields : DEFAULT_CONTACT_FORM.fields,
          }));
          setForms(mapped);
          setSelectedForm(mapped[0]);
        }
      }).catch(() => {});
    }

    if (!loadedFromApi) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setForms(parsed);
            setSelectedForm(parsed[0]);
            return;
          }
        }
      } catch {
        // fallback
      }
      setForms([DEFAULT_CONTACT_FORM]);
      setSelectedForm(DEFAULT_CONTACT_FORM);
    }
  }, [storageKey, websiteId]);

  // Save forms
  const persistForms = (updated: CustomForm[]) => {
    setForms(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCreateNewForm = () => {
    const newForm: CustomForm = {
      id: `form_${Date.now()}`,
      name: 'New Custom Form',
      slug: `custom-form-${Date.now().toString(36)}`,
      description: 'Collect inquiries and data from visitors.',
      submitButtonText: 'Submit Inquiry',
      successMessage: 'Thank you! Your submission has been received.',
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: [
        { id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Jane Doe' },
        { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'jane@example.com' },
        { id: 'message', name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help?' },
      ],
    };
    const next = [...forms, newForm];
    persistForms(next);
    setSelectedForm(newForm);
    setIsEditing(true);
    
    if (websiteId) {
      void cmsFormsApi.create(websiteId, {
        name: newForm.name,
        slug: newForm.slug,
        title: newForm.name,
        description: newForm.description,
        fields: newForm.fields,
        settings: {
          submitButtonText: newForm.submitButtonText,
          successMessage: newForm.successMessage,
        },
        isActive: newForm.enabled,
      }).catch(() => {});
    }

    toast.success('New form created');
  };

  const handleUpdateForm = (changes: Partial<CustomForm>) => {
    if (!selectedForm) return;
    const updated: CustomForm = {
      ...selectedForm,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    setSelectedForm(updated);
    const next = forms.map((f) => (f.id === updated.id ? updated : f));
    persistForms(next);

    if (websiteId && updated.id) {
      void cmsFormsApi.update(websiteId, updated.id, {
        name: updated.name,
        slug: updated.slug,
        title: updated.name,
        description: updated.description,
        fields: updated.fields,
        settings: {
          submitButtonText: updated.submitButtonText,
          successMessage: updated.successMessage,
        },
        isActive: updated.enabled,
      }).catch(() => {});
    }
  };

  const handleDeleteForm = (formId: string) => {
    if (forms.length <= 1) {
      toast.error('You must keep at least one active form.');
      return;
    }
    const next = forms.filter((f) => f.id !== formId);
    persistForms(next);
    setSelectedForm(next[0] || null);

    if (websiteId) {
      void cmsFormsApi.delete(websiteId, formId).catch(() => {});
    }

    toast.success('Form deleted');
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (!selectedForm) return;
    const fields = [...selectedForm.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const [moved] = fields.splice(index, 1);
    fields.splice(targetIndex, 0, moved);
    handleUpdateForm({ fields });
  };

  const handleDeleteField = (fieldId: string) => {
    if (!selectedForm) return;
    if (selectedForm.fields.length <= 1) {
      toast.error('A form must have at least one field.');
      return;
    }
    const fields = selectedForm.fields.filter((f) => f.id !== fieldId);
    handleUpdateForm({ fields });
    toast.success('Field removed');
  };

  const handleSaveField = (field: CustomFormField) => {
    if (!selectedForm) return;
    let fields: CustomFormField[];
    const exists = selectedForm.fields.some((f) => f.id === field.id);
    if (exists) {
      fields = selectedForm.fields.map((f) => (f.id === field.id ? field : f));
    } else {
      fields = [...selectedForm.fields, field];
    }
    handleUpdateForm({ fields });
    setFieldEditorOpen(false);
    setEditingField(null);
    toast.success('Field updated');
  };

  const openAddField = () => {
    const id = `field_${Date.now().toString(36)}`;
    setEditingField({
      id,
      name: id,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: '',
    });
    setFieldEditorOpen(true);
  };

  const openEditField = (field: CustomFormField) => {
    setEditingField({ ...field });
    setFieldEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Forms"
        description="Design and manage forms for collecting leads, customer inquiries, and subscriptions."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/leads">
                <Inbox className="mr-2 h-4 w-4" />
                View Submissions
              </Link>
            </Button>
            <Button size="sm" onClick={handleCreateNewForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form Selector List */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Your Forms</CardTitle>
              <CardDescription className="text-xs">
                Select a form to configure its fields and options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {forms.map((form) => (
                <div
                  key={form.id}
                  onClick={() => setSelectedForm(form)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                    selectedForm?.id === form.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card/60 hover:bg-muted/40'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{form.name}</span>
                      {form.enabled ? (
                        <Badge variant="success" className="h-4 px-1.5 text-[9px]">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {form.fields.length} fields · /{form.slug}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Help Card */}
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex items-start gap-3 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Using forms in Visual Builder</p>
                <p>
                  In the website builder, insert a <strong>Contact Form</strong> block from the Add Elements panel. It will automatically connect to your submissions inbox.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Form Editor & Fields */}
        {selectedForm ? (
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold">{selectedForm.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedForm.slug}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {selectedForm.description || 'Configured for website inquiries.'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewValues({});
                      setPreviewSubmitted(false);
                      setPreviewOpen(true);
                    }}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteForm(selectedForm.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Basic Configuration */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Form Title</Label>
                    <Input
                      value={selectedForm.name}
                      onChange={(e) => handleUpdateForm({ name: e.target.value })}
                      placeholder="e.g. Contact Us"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Identifier Slug</Label>
                    <Input
                      value={selectedForm.slug}
                      onChange={(e) => handleUpdateForm({ slug: e.target.value })}
                      placeholder="e.g. contact-form"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-semibold">Description</Label>
                    <Input
                      value={selectedForm.description || ''}
                      onChange={(e) => handleUpdateForm({ description: e.target.value })}
                      placeholder="Subtitle or guidance for visitors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Submit Button Text</Label>
                    <Input
                      value={selectedForm.submitButtonText}
                      onChange={(e) => handleUpdateForm({ submitButtonText: e.target.value })}
                      placeholder="Send Message"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Success Message</Label>
                    <Input
                      value={selectedForm.successMessage}
                      onChange={(e) => handleUpdateForm({ successMessage: e.target.value })}
                      placeholder="Thanks! We will reply shortly."
                    />
                  </div>
                </div>

                {/* Fields Section */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold tracking-tight">Form Fields</h4>
                      <p className="text-xs text-muted-foreground">
                        Drag or move fields up/down. Click to edit labels, types, and validation.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={openAddField}>
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedForm.fields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/70 p-3 shadow-xs transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-foreground"
                              disabled={idx === 0}
                              onClick={() => handleMoveField(idx, 'up')}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-foreground"
                              disabled={idx === selectedForm.fields.length - 1}
                              onClick={() => handleMoveField(idx, 'down')}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{field.label}</span>
                              {field.required && (
                                <Badge variant="destructive" className="h-4 px-1.5 text-[9px]">
                                  Required
                                </Badge>
                              )}
                              <Badge variant="secondary" className="h-4 px-1.5 text-[9px] uppercase font-mono">
                                {field.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">name=&ldquo;{field.name}&rdquo;</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditField(field)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <EmptyState
              title="No form selected"
              description="Choose a form from the left or create a new one to begin customization."
              actionLabel="Create Form"
              onAction={handleCreateNewForm}
            />
          </div>
        )}
      </div>

      {/* Field Editor Dialog */}
      <Dialog open={fieldEditorOpen} onOpenChange={setFieldEditorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Field</DialogTitle>
            <DialogDescription>
              Set the label, input type, and validation rules for this field.
            </DialogDescription>
          </DialogHeader>

          {editingField && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Field Label</Label>
                <Input
                  value={editingField.label}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      label: e.target.value,
                      name: editingField.name === editingField.id ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') : editingField.name,
                    })
                  }
                  placeholder="e.g. Phone Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Internal Name</Label>
                  <Input
                    value={editingField.name}
                    onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                    placeholder="phone"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Field Type</Label>
                  <Select
                    value={editingField.type}
                    onValueChange={(val: FormFieldType) => setEditingField({ ...editingField, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editingField.type !== 'checkbox' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Placeholder Text</Label>
                  <Input
                    value={editingField.placeholder || ''}
                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                    placeholder="e.g. Enter your contact number..."
                  />
                </div>
              )}

              {editingField.type === 'select' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Options (comma-separated)</Label>
                  <Input
                    value={(editingField.options || []).join(', ')}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        options: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="General Inquiry, Support, Partnership"
                  />
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Required Field</Label>
                  <p className="text-xs text-muted-foreground">
                    Visitors must provide a value to submit the form.
                  </p>
                </div>
                <Switch
                  checked={editingField.required}
                  onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => editingField && handleSaveField(editingField)}>
              Save Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Form Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Form Live Preview</DialogTitle>
            <DialogDescription>
              Test how your visitors will see and interact with this form on your published website.
            </DialogDescription>
          </DialogHeader>

          {selectedForm && (
            <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-xs">
              <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight">{selectedForm.name}</h3>
                {selectedForm.description && (
                  <p className="text-xs text-muted-foreground">{selectedForm.description}</p>
                )}
              </div>

              {previewSubmitted ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
                  <Check className="mx-auto h-6 w-6 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-400">{selectedForm.successMessage}</p>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewSubmitted(false)}>
                    Reset form preview
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPreviewSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  {selectedForm.fields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                      </Label>

                      {field.type === 'text' && (
                        <Input
                          required={field.required}
                          placeholder={field.placeholder}
                          value={previewValues[field.name] || ''}
                          onChange={(e) =>
                            setPreviewValues({ ...previewValues, [field.name]: e.target.value })
                          }
                        />
                      )}

                      {field.type === 'email' && (
                        <Input
                          type="email"
                          required={field.required}
                          placeholder={field.placeholder || 'user@example.com'}
                          value={previewValues[field.name] || ''}
                          onChange={(e) =>
                            setPreviewValues({ ...previewValues, [field.name]: e.target.value })
                          }
                        />
                      )}

                      {field.type === 'phone' && (
                        <Input
                          type="tel"
                          required={field.required}
                          placeholder={field.placeholder || '+1 (555) 000-0000'}
                          value={previewValues[field.name] || ''}
                          onChange={(e) =>
                            setPreviewValues({ ...previewValues, [field.name]: e.target.value })
                          }
                        />
                      )}

                      {field.type === 'textarea' && (
                        <Textarea
                          required={field.required}
                          placeholder={field.placeholder || 'Your message...'}
                          value={previewValues[field.name] || ''}
                          onChange={(e) =>
                            setPreviewValues({ ...previewValues, [field.name]: e.target.value })
                          }
                          rows={3}
                        />
                      )}

                      {field.type === 'select' && (
                        <Select
                          value={previewValues[field.name] || ''}
                          onValueChange={(val) =>
                            setPreviewValues({ ...previewValues, [field.name]: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            required={field.required}
                            id={`preview_${field.id}`}
                            className="rounded border-border"
                          />
                          <label htmlFor={`preview_${field.id}`} className="text-xs text-muted-foreground">
                            {field.placeholder || 'I agree to the terms and privacy policy.'}
                          </label>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    {selectedForm.submitButtonText || 'Submit'}
                  </Button>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
