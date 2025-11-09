import React from 'react';
import { cn } from '@/communities/lib/utils';
interface GradientAvatarProps {
  className?: string;
  seed?: string;
}
export function GradientAvatar({
  className,
  seed = ''
}: GradientAvatarProps) {
  // Generate consistent gradient based on seed
  const getGradient = (s: string) => {
    const gradients = ['bg-gradient-to-br from-dq-navy to-[#1A2E6E]',
    // navy to darker navy
    'bg-gradient-to-br from-[#1A2E6E] to-dq-navy',
    // darker navy to navy
    'bg-gradient-to-br from-dq-navy to-[#13285A]',
    // navy to very dark navy
    'bg-gradient-to-br from-[#13285A] to-dq-navy' // very dark navy to navy
    ];
    const hash = s.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return gradients[Math.abs(hash) % gradients.length];
  };
  return <div className={cn('flex items-center justify-center', getGradient(seed), className)} />;
}