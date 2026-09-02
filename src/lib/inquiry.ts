/** Shape and validation shared by the enquiry form and the API route. */

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  vehicle: string;
  message: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryPayload, string>>;

export type InquiryValues = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Upper bounds. Anything longer is a mistake or an abuse attempt, not an enquiry. */
export const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  vehicle: 160,
  message: 5000,
} as const;

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};

  const name = values.name.trim();
  if (name.length < 2) {
    errors.name = 'Please enter your name.';
  } else if (name.length > LIMITS.name) {
    errors.name = 'That name is longer than we can accept.';
  }

  const email = values.email.trim();
  if (!EMAIL.test(email) || email.length > LIMITS.email) {
    errors.email = 'Please enter an email address we can reply to.';
  }

  // Phone is optional, but validate it when something has been typed.
  const phone = values.phone.trim();
  if (phone && phone.replace(/[^\d]/g, '').length < 7) {
    errors.phone = 'That phone number looks incomplete.';
  } else if (phone.length > LIMITS.phone) {
    errors.phone = 'That phone number is longer than we can accept.';
  }

  if (!values.vehicle.trim()) {
    errors.vehicle = 'Please choose a model, or select “Something else”.';
  } else if (values.vehicle.length > LIMITS.vehicle) {
    errors.vehicle = 'That selection is not one of the options.';
  }

  const message = values.message.trim();
  if (message.length < 12) {
    errors.message = 'A sentence or two about what you are after helps.';
  } else if (message.length > LIMITS.message) {
    errors.message = 'That message is longer than we can accept. Please shorten it.';
  }

  return errors;
}

/** Header-injection guard for anything interpolated into a subject or Reply-To. */
export function sanitiseHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}
