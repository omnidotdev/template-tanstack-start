import { Avatar as ArkAvatar, useAvatar as useArkAvatar } from "@ark-ui/react";
import { cva } from "class-variance-authority";

import cn from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "size-8 text-xs",
        sm: "size-9 text-sm",
        md: "size-10 text-md",
        lg: "size-11 text-lg",
        xl: "size-12 text-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const useAvatar = useArkAvatar;

const AvatarProvider = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.RootProvider> &
  VariantProps<typeof avatarVariants>) => (
  <ArkAvatar.RootProvider
    className={cn(avatarVariants({ size, className }))}
    {...rest}
  />
);

const AvatarRoot = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.Root> &
  VariantProps<typeof avatarVariants>) => (
  <ArkAvatar.Root
    className={cn(avatarVariants({ size, className }))}
    {...rest}
  />
);

const AvatarFallback = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAvatar.Fallback>) => (
  <ArkAvatar.Fallback
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...rest}
  />
);

const AvatarImage = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAvatar.Image>) => (
  <ArkAvatar.Image
    className={cn("aspect-square size-full", className)}
    alt="Avatar"
    {...rest}
  />
);

interface AvatarProps extends ComponentProps<typeof AvatarRoot> {
  src: string | Blob | undefined;
  alt: string | undefined;
  fallback: ReactNode;
}

const Avatar = ({
  src,
  alt,
  fallback,
  className,
  size,
  ...rest
}: AvatarProps) => (
  <AvatarRoot size={size} className={className} {...rest}>
    <AvatarFallback className={className}>{fallback}</AvatarFallback>

    <AvatarImage src={src} alt={alt} className={className} />
  </AvatarRoot>
);

export {
  Avatar,
  AvatarRoot,
  AvatarFallback,
  AvatarImage,
  AvatarProvider,
  useAvatar,
  type AvatarProps,
};
