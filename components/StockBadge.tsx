export default function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-block rounded-[var(--radius)] border border-grey-line bg-white text-muted text-sm font-medium px-2.5 py-0.5">
        Sold out
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-block rounded-[var(--radius)] border border-blue bg-white text-blue text-sm font-medium px-2.5 py-0.5">
        Only {stock} left
      </span>
    );
  }

  return null;
}
