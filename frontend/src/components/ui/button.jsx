// JavaScript shadcn/ui button pattern; Radix Slot preserves link semantics.
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';
const variants = cva('button', { variants: { variant: { default: 'button-primary', outline: 'button-outline', ghost: 'button-ghost' },
  size: { default: '', icon: 'button-icon' } }, defaultVariants: { variant: 'default', size: 'default' } });
export function Button({ asChild = false, className, variant, size, type = 'button', ...props }) {
  const Component = asChild ? Slot : 'button';
  return <Component {...(!asChild ? { type } : {})} className={cn(variants({ variant, size }), className)} {...props} />;
}
