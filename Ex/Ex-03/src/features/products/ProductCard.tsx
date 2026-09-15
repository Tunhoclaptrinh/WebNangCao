import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { addItem } from '../cart/cartSlice.ts';
import type { Product } from './productTypes.ts';

interface ProductCardProps {
  product: Product;
  onAddToCartSuccess?: (name: string) => void;
}

export function ProductCard({ product, onAddToCartSuccess }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((i) => i.id === product.id)
  );

  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = currentCartQty >= product.stock;

  const handleAddToCart = () => {
    if (isOutOfStock || isMaxInCart) return;

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        stock: product.stock,
        imageColor: product.imageColor,
        quantity: 1,
      })
    );

    if (onAddToCartSuccess) {
      onAddToCartSuccess(product.name);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="product-card">
      {/* Khung ảnh giả lập công nghệ sang trọng */}
      <div className="product-media" style={{ background: product.imageColor }}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {discountPercent > 0 && (
          <span className="product-discount-tag">-{discountPercent}%</span>
        )}
        <div className="product-icon-wrap">
          {product.category === 'Màn hình' && '🖥️'}
          {product.category === 'Bàn phím' && '⌨️'}
          {product.category === 'Chuột' && '🖱️'}
          {product.category === 'Âm thanh' && '🎧'}
          {product.category === 'Phụ kiện' && '💡'}
        </div>
      </div>

      <div className="product-content">
        <div className="product-cat-row">
          <span className="product-category">{product.category}</span>
          <span className="product-rating">
            ★ {product.rating} <span className="review-count">({product.reviewsCount})</span>
          </span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc">{product.description}</p>

        {/* Thông số kỹ thuật nhanh */}
        <div className="product-specs">
          {product.specs.slice(0, 3).map((spec, idx) => (
            <span key={idx} className="spec-tag">
              {spec}
            </span>
          ))}
        </div>

        <div className="product-footer">
          <div className="price-box">
            <span className="current-price">
              {product.price.toLocaleString('vi-VN')} đ
            </span>
            {product.originalPrice && (
              <span className="original-price">
                {product.originalPrice.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>

          <div className="stock-info">
            {isOutOfStock ? (
              <span className="stock-out">Hết hàng</span>
            ) : product.stock < 10 ? (
              <span className="stock-low">Chỉ còn {product.stock} cái</span>
            ) : (
              <span className="stock-available">Còn hàng ({product.stock})</span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxInCart}
        >
          {isOutOfStock ? (
            'Tạm hết hàng'
          ) : isMaxInCart ? (
            `Đã đạt tối đa trong giỏ (${currentCartQty})`
          ) : (
            <>
              <span>🛒 Thêm vào giỏ</span>
              {currentCartQty > 0 && (
                <span className="in-cart-count">({currentCartQty})</span>
              )}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
