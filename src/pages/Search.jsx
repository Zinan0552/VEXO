import { useLocation } from 'react-router-dom';
import { Product } from '../data/Product.js';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const term = query.get("q") || "";

  const filtered = Product.filter(p =>
    p.name.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Search results for "{term}"
      </h1>
      {filtered.length > 0 ? (
        <ProductGrid Product={filtered} />
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}
