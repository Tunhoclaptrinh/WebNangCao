import { useAppDispatch } from '../../app/hooks.ts';
import { removeItem, updateQuantity } from './cartSlice.ts';
import type { CartItem } from './cartTypes.ts';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  const handleDecrease = () => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  return (
    <div className="cart-item-row">
      <div className="item-thumb" style={{ background: item.imageColor }}>
        {item.category === 'Màn hình' && '🖥️'}
        {item.category === 'Bàn phím' && '⌨️'}
        {item.category === 'Chuột' && '🖱️'}
        {item.category === 'Âm thanh' && '🎧'}
        {item.category === 'Phụ kiện' && '💡'}
      </div>

      <div className="item-info">
        <span className="item-cat">{item.category}</span>
        <h4 className="item-title">{item.name}</h4>
        <div className="item-price-unit">
          {item.price.toLocaleString('vi-VN')} đ
        </div>
      </div>

      <div className="item-actions">
        <div className="item-qty-selector">
          <button
            type="button"
            className="btn-qty"
            onClick={handleDecrease}
            title="Giảm số lượng"
          >
            -
          </button>
          <span className="qty-number">{item.quantity}</span>
          <button
            type="button"
            className="btn-qty"
            onClick={handleIncrease}
            disabled={item.quantity >= item.stock}
            title={item.quantity >= item.stock ? 'Đã đạt tồn kho tối đa' : 'Tăng số lượng'}
          >
            +
          </button>
        </div>

        <div className="item-subtotal">
          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
        </div>

        <button
          type="button"
          className="btn-remove-item"
          onClick={handleRemove}
          title="Xóa khỏi giỏ hàng"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
