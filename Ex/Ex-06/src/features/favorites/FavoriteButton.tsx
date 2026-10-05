import { useState } from 'react';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Tooltip, App } from 'antd';
import type { Product } from '../products/productTypes.ts';
import { useFavoritesStore } from '../../store/useFavoritesStore.ts';
import { useFavoritesContext } from '../../context/FavoritesContext.tsx';
import type { StateEngine } from '../../types/favoriteTypes.ts';

interface FavoriteButtonProps {
  product: Product;
  engine?: StateEngine;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

export function FavoriteButton({ product, engine = 'zustand', size = 'middle', style }: FavoriteButtonProps) {
  const { message } = App.useApp();
  const [animating, setAnimating] = useState(false);

  // Zustand Store
  const zustandIsFav = useFavoritesStore((s) => s.favorites.some((i) => i.id === product.id));
  const zustandToggle = useFavoritesStore((s) => s.toggleFavorite);

  // Context API
  const contextStore = useFavoritesContext();

  const isFavorited = engine === 'zustand' ? zustandIsFav : contextStore.isFavorite(product.id);
  const toggle = engine === 'zustand' ? zustandToggle : contextStore.toggleFavorite;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    toggle(product);

    if (!isFavorited) {
      message.success({
        content: `Đã thêm "${product.name}" vào danh sách yêu thích! (${engine.toUpperCase()})`,
        duration: 2,
      });
    } else {
      message.info({
        content: `Đã bỏ "${product.name}" khỏi danh sách yêu thích.`,
        duration: 2,
      });
    }
  };

  return (
    <Tooltip title={isFavorited ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}>
      <Button
        type="text"
        shape="circle"
        size={size}
        onClick={handleClick}
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
          border: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: animating ? 'scale(1.25)' : 'scale(1)',
          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          ...style,
        }}
        icon={
          isFavorited ? (
            <HeartFilled style={{ color: '#ff4d4f', fontSize: size === 'small' ? 14 : 17 }} />
          ) : (
            <HeartOutlined style={{ color: '#6b7280', fontSize: size === 'small' ? 14 : 17 }} />
          )
        }
        aria-label={isFavorited ? 'Bỏ thích' : 'Yêu thích'}
      />
    </Tooltip>
  );
}
