import { buttonVariants } from "@/components/ui/button";
import cn from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";

const ExternalLink = ({
  variant,
  size,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>) => (
  <a
    className={cn(buttonVariants({ variant, size }), className)}
    {...rest}
    target="blank"
    rel="noopener noreferrer"
  />
);

export default ExternalLink;
