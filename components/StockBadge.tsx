export default function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-block rounded-[var(--radius)] border border-grey-line bg-white text-muted text-xs font-medium px-3 py-1">
        Sold out
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-block rounded-[var(--radius)] border border-blue bg-white text-blue text-xs font-medium px-3 py-1">
        Only {stock} left
      </span>
    );
  }

  return null;
}
