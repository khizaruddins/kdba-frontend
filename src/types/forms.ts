export type FormFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';

export interface CustomFormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export interface CustomForm {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: CustomFormField[];
  submitButtonText: string;
  successMessage: string;
  notifyEmail?: string;
  enabled: boolean;
  submissionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CONTACT_FORM: CustomForm = {
  id: 'default-contact-form',
  name: 'General Contact Form',
  slug: 'contact-form',
  description: 'Primary customer inquiry and contact form displayed on the website.',
  submitButtonText: 'Send Message',
  successMessage: 'Thank you! Your message has been sent successfully.',
  enabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  fields: [
    {
      id: 'name',
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. John Doe',
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'e.g. john@example.com',
    },
    {
      id: 'phone',
      name: 'phone',
      label: 'Phone Number',
      type: 'phone',
      required: false,
      placeholder: 'e.g. +1 (555) 000-0000',
    },
    {
      id: 'message',
      name: 'message',
      label: 'Your Message',
      type: 'textarea',
      required: true,
      placeholder: 'How can we help you?',
    },
  ],
};
