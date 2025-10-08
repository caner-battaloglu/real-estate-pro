export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card p-10 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
}
