export default function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-block rounded-full bg-ink text-cream text-xs font-bold px-3 py-1">
        Sold out
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-block rounded-full bg-gold text-gold-ink text-xs font-bold px-3 py-1">
        Only {stock} left
      </span>
    );
  }

  return null;
}
