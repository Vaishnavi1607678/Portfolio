export default function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <p className="eyebrow">
      <span>({index})</span> {label}
    </p>
  );
}
