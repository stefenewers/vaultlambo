/** Shape and validation shared by the inquiry form and the API route. */

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  vehicle: string;
  message: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryPayload, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(values: {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  message: string;
}): InquiryErrors {
  const errors: InquiryErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }
  if (!EMAIL.test(values.email.trim())) {
    errors.email = 'Please enter an email address we can reply to.';
  }
  // Phone is optional, but validate it when something has been typed.
  if (values.phone.trim() && values.phone.replace(/[^\d]/g, '').length < 7) {
    errors.phone = 'That phone number looks incomplete.';
  }
  if (!values.vehicle.trim()) {
    errors.vehicle = 'Please choose a vehicle or select “Something else”.';
  }
  if (values.message.trim().length < 12) {
    errors.message = 'A sentence or two about what you are after helps.';
  }

  return errors;
}
