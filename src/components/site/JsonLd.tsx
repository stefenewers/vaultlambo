export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Structured data is built from local, typed data only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
