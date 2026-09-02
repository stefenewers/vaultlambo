'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { LIMITS, validateInquiry, type InquiryErrors } from '@/lib/inquiry';
import { siteConfig } from '@/site.config';

export type Option = { value: string; label: string };

/**
 * Options grouped by collection. Grouping matters here: it keeps "Models we source"
 * visibly separate from "Available now", so choosing a model brief never reads as
 * choosing a car in stock.
 */
export type OptionGroup = { label: string; options: Option[] };

type Props = {
  groups: OptionGroup[];
  /** Preselects the entry, e.g. when the form is reached from a detail page. */
  defaultVehicle?: string;
  /** Prefills the message. */
  defaultMessage?: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const OTHER = 'Something else';

export function InquiryForm({ groups, defaultVehicle, defaultMessage }: Props) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: defaultVehicle ?? '',
    message: defaultMessage ?? '',
  });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  /** Errors are only summarised after a submit attempt, not while first typing. */
  const [showSummary, setShowSummary] = useState(false);
  const formId = useId();

  /** Field order for the summary, so it matches the visual order of the form. */
  const FIELD_ORDER = ['name', 'email', 'phone', 'vehicle', 'message'] as const;

  const summaryErrors = showSummary
    ? FIELD_ORDER.flatMap((field) => {
        const message = errors[field];
        return message ? ([[field, message]] as [string, string][]) : [];
      })
    : [];

  const set = (key: keyof typeof values, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-validate live only for fields the user has already left once.
    if (touched[key]) setErrors(validateInquiry(next));
  };

  const blur = (key: keyof typeof values) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateInquiry(values));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validateInquiry(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: true, vehicle: true, message: true });

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the summary so the whole list is announced, rather than only
      // the first bad field. The summary links on to each individual control.
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setShowSummary(false);
    setStatus('submitting');
    try {
      const response = await fetch(siteConfig.inquiryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, company: honeypot.current?.value ?? '' }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { errors?: InquiryErrors; error?: string }
          | null;
        if (data?.errors) setErrors(data.errors);
        setFormError(
          data?.error ??
            (siteConfig.contact.email
              ? `The message could not be sent. Please try again, or email ${siteConfig.contact.email} directly.`
              : 'The message could not be sent. Please try again in a moment.'),
        );
        setStatus('error');
        return;
      }

      setStatus('success');
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFormError(
        siteConfig.contact.email
          ? `The message could not be sent. Please try again, or email ${siteConfig.contact.email} directly.`
          : 'The message could not be sent. Please try again in a moment.',
      );
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-line-strong bg-ink-raised p-8 sm:p-10"
      >
        <p className="label-xs">Received</p>
        <h2 className="mt-3 text-xl font-medium tracking-[-0.015em] text-bone">
          Thanks &mdash; we have it.
        </h2>
        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-bone-dim">
          Your enquiry about <strong className="text-bone">{values.vehicle}</strong> has
          been sent and will be answered directly.
          {siteConfig.contact.email ? (
            <>
              {' '}If it is urgent, email{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="link-underline text-bone"
              >
                {siteConfig.contact.email}
              </a>
              .
            </>
          ) : null}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({
              name: '',
              email: '',
              phone: '',
              vehicle: defaultVehicle ?? '',
              message: '',
            });
            setErrors({});
            setTouched({});
            setStatus('idle');
          }}
          className="btn btn-secondary btn-sm mt-8"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field
        id={`${formId}-name`}
        name="name"
        label="Name"
        value={values.name}
        error={touched.name ? errors.name : undefined}
        onChange={(v) => set('name', v)}
        onBlur={() => blur('name')}
        autoComplete="name"
      />
      <Field
        id={`${formId}-email`}
        name="email"
        label="Email"
        type="email"
        value={values.email}
        error={touched.email ? errors.email : undefined}
        onChange={(v) => set('email', v)}
        onBlur={() => blur('email')}
        autoComplete="email"
        inputMode="email"
      />
      <Field
        id={`${formId}-phone`}
        name="phone"
        label="Phone"
        optional
        type="tel"
        value={values.phone}
        error={touched.phone ? errors.phone : undefined}
        onChange={(v) => set('phone', v)}
        onBlur={() => blur('phone')}
        autoComplete="tel"
        inputMode="tel"
      />

      <div>
        <FieldLabel htmlFor={`${formId}-vehicle`}>Vehicle or model</FieldLabel>
        <div className="relative">
          <select
            id={`${formId}-vehicle`}
            name="vehicle"
            value={values.vehicle}
            onChange={(e) => set('vehicle', e.target.value)}
            onBlur={() => blur('vehicle')}
            aria-invalid={touched.vehicle && Boolean(errors.vehicle)}
            aria-describedby={
              touched.vehicle && errors.vehicle ? `${formId}-vehicle-error` : undefined
            }
            className={`h-12 w-full cursor-pointer appearance-none border bg-ink-raised pl-3.5 pr-9 text-[0.9375rem] transition-colors focus:border-line-strong ${
              touched.vehicle && errors.vehicle
                ? 'border-line-strong text-bone'
                : 'border-line text-bone'
            }`}
          >
            <option value="" className="bg-[#101012]">
              Select a vehicle or model…
            </option>
            {groups.map((group) => (
              <optgroup
                key={group.label}
                label={group.label}
                className="bg-[#101012] text-[#f3f0ea]"
              >
                {group.options.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className="bg-[#101012] text-[#f3f0ea]"
                  >
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={OTHER} className="bg-[#101012] text-[#f3f0ea]">
              {OTHER}
            </option>
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-steel-dim"
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </div>
        <FieldError id={`${formId}-vehicle-error`}>
          {touched.vehicle ? errors.vehicle : undefined}
        </FieldError>
      </div>

      <div className="sm:col-span-2">
        <FieldLabel htmlFor={`${formId}-message`}>Message</FieldLabel>
        <textarea
          id={`${formId}-message`}
          name="message"
          maxLength={LIMITS.message}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          onBlur={() => blur('message')}
          rows={6}
          aria-invalid={touched.message && Boolean(errors.message)}
          aria-describedby={
            touched.message && errors.message ? `${formId}-message-error` : undefined
          }
          placeholder="Specification, colour, timing — anything that narrows the search."
          className={`w-full resize-y border bg-ink-raised p-3.5 text-[0.9375rem] leading-relaxed text-bone placeholder:text-steel-dim transition-colors focus:border-line-strong ${
            touched.message && errors.message ? 'border-line-strong' : 'border-line'
          }`}
        />
        <FieldError id={`${formId}-message-error`}>
          {touched.message ? errors.message : undefined}
        </FieldError>
      </div>

      {/* Honeypot — visually and semantically hidden from people. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          ref={honeypot}
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/*
        Error summary. Announced on submit and linking to each invalid field, so a
        screen-reader user gets the whole picture at once rather than discovering
        problems one field at a time.
      */}
      {summaryErrors.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border border-line-strong bg-ink-raised p-5 sm:col-span-2"
        >
          <h3 className="text-sm font-medium text-bone">
            {summaryErrors.length === 1
              ? 'One field needs attention'
              : `${summaryErrors.length} fields need attention`}
          </h3>
          <ul className="mt-3 space-y-1.5">
            {summaryErrors.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${formId}-${field}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(`${formId}-${field}`)?.focus();
                  }}
                  className="link-underline text-sm text-bone-dim hover:text-bone"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn btn-primary disabled:opacity-60"
          >
            {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
          </button>
          {/* Said plainly, next to the action it applies to. */}
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-steel-dim">
            Your details are used only to answer this enquiry.{' '}
            {/*
              A link inside a paragraph carries a permanent underline. The animated
              `link-underline` treatment used for navigation would leave this
              distinguishable by colour alone until hovered.
            */}
            <Link
              href="/privacy"
              className="text-bone-dim underline underline-offset-2 transition-colors hover:text-bone"
            >
              How we handle enquiries
            </Link>
            .
          </p>
        </div>

        {siteConfig.contact.responseTime ? (
          <p className="text-xs leading-relaxed text-steel-dim sm:max-w-xs sm:text-right">
            {siteConfig.contact.responseTime}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p
          role="alert"
          className="border-l border-line-strong py-1 pl-4 text-sm text-bone-dim sm:col-span-2"
        >
          {formError}
        </p>
      ) : null}
    </form>
  );
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="label-xs mb-2.5 block">
      {children}
      {optional ? (
        <span className="ml-2 normal-case tracking-normal text-steel-dim">
          optional
        </span>
      ) : null}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 text-xs text-bone-dim">
      {children}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  optional = false,
  autoComplete,
  inputMode,
}: {
  id: string;
  /** Real form control name, so browser autofill and password managers behave. */
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: 'email' | 'tel' | 'text';
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full border bg-ink-raised px-3.5 text-[0.9375rem] text-bone transition-colors focus:border-line-strong ${
          error ? 'border-line-strong' : 'border-line'
        }`}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}
