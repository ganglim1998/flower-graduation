'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFavorite } from './api';

type Props = {
  floristId: string;
  schoolId: string;
  isFavorite: boolean;
  size?: 'sm' | 'lg';
};

export default function FavoriteButton({ floristId, schoolId, isFavorite, size = 'sm' }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleFavorite(floristId, schoolId, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-schools'] });
    },
  });

  return (
    <button
      type="button"
      aria-label={isFavorite ? '관심 학교 해제' : '관심 학교 등록'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      className={`shrink-0 leading-none transition-transform active:scale-90 ${
        size === 'lg' ? 'text-2xl' : 'text-xl'
      } ${mutation.isPending ? 'opacity-40' : ''}`}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
