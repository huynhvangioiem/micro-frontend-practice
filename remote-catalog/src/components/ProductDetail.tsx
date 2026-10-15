import { Link, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products';
import { useAsync } from '../hooks/useAsync';
import AddToCartButton from './AddToCartButton';
import './Catalog.css';

const ProductDetail = () => {
  const { id = '' } = useParams();
  const { data: product, error, loading } = useAsync(
    (signal) => fetchProduct(id, signal),
    id,
  );

  return (
    <div className="catalog">
      {/* relative="path" goes up one URL segment, regardless of how the host mounts us. */}
      <Link to=".." relative="path" className="catalog__back">
        ← Back to products
      </Link>

      {loading && <div className="product-detail product-detail--skeleton" aria-busy="true" />}
      {error && (
        <p className="catalog__status catalog__status--error">
          Could not load this product ({error.message}). Go back and try another one.
        </p>
      )}

      {product && (
        <article className="product-detail">
          <img src={product.thumbnail} alt={product.title} />
          <div className="product-detail__info">
            <span className="product-card__category">{product.category}</span>
            <h1>{product.title}</h1>
            <p className="product-detail__meta">
              {product.brand ? `${product.brand} · ` : ''}★ {product.rating.toFixed(1)}
            </p>
            <p className="product-detail__description">{product.description}</p>
            <p className="product-detail__price"><span className="highlight">${product.price.toFixed(2)}</span></p>
            <p className="product-detail__meta">{product.stock} in stock</p>
            <AddToCartButton product={product} />
          </div>
        </article>
      )}
    </div>
  );
};

export default ProductDetail;
