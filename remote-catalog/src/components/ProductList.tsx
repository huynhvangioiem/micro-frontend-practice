import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import AddToCartButton from './AddToCartButton';
import './Catalog.css';

const SEARCH_DEBOUNCE_MS = 300;
const SKELETON_COUNT = 8;

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  // Wait for the user to stop typing before hitting the API.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const categories = useAsync(fetchCategories, 'categories');
  const products = useAsync(
    (signal) => fetchProducts({ query, category }, signal),
    `${query}|${category}`,
  );

  return (
    <div className="catalog">
      <div className="catalog__filters">
        <input
          type="search"
          placeholder="Search products…"
          aria-label="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          disabled={query !== ''}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.data?.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {products.error && (
        <p className="catalog__status catalog__status--error">
          Could not load products ({products.error.message}). Check your connection and reload.
        </p>
      )}
      {!products.loading && !products.error && products.data?.length === 0 && (
        <p className="catalog__status">No products match “{query}”. Try a shorter search.</p>
      )}

      <ul className="catalog__grid" aria-busy={products.loading}>
        {products.loading &&
          Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <li key={index} className="product-card product-card--skeleton" aria-hidden="true" />
          ))}
        {!products.loading &&
          products.data?.map((product) => (
            <li key={product.id} className="product-card">
              <Link to={String(product.id)} className="product-card__link">
                <img src={product.thumbnail} alt="" loading="lazy" />
                <div className="product-card__body">
                  <span className="product-card__category">{product.category}</span>
                  <span className="product-card__title">{product.title}</span>
                  <span className="product-card__price highlight">${product.price.toFixed(2)}</span>
                </div>
              </Link>
              <div className="product-card__action">
                <AddToCartButton product={product} />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProductList;
