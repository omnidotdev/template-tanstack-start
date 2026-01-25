import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { Check, ChevronRight } from "lucide-react";

import cn from "@/lib/utils";

import type { ark } from "@ark-ui/react";
import type { ComponentProps } from "react";

const MenuProvider = ArkMenu.RootProvider;
const MenuRoot = ArkMenu.Root;
const PrimitiveMenuIndicator = ArkMenu.ItemIndicator;

const MenuTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Trigger>) => (
  <ArkMenu.Trigger className={className} {...rest} />
);

const MenuPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Positioner>) => (
  <ArkMenu.Positioner className={className} {...rest} />
);

const MenuContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Content>) => (
  <ArkMenu.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex min-w-32 origin-(--transform-origin) flex-col gap-0.5 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const MenuArrow = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Arrow>) => (
  <ArkMenu.Arrow className={cn("fill-popover", className)} {...rest} />
);

const MenuArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ArrowTip>) => (
  <ArkMenu.ArrowTip className={cn("fill-border", className)} {...rest} />
);

const MenuItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.Item>) => (
  <ArkMenu.Item
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-inset:pl-8 data-[state=checked]:text-accent-foreground data-[variant=destructive]:text-destructive data-highlighted:text-accent-foreground data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 [&[data-state=checked][data-highlighted]]:bg-sidebar-accent/80 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive!",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.Item>
);

const MenuCheckboxItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.CheckboxItem>) => (
  <ArkMenu.CheckboxItem
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50 [&[data-state=checked][data-highlighted]]:bg-sidebar-accent/80",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.CheckboxItem>
);

const MenuItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemGroup>) => (
  <ArkMenu.ItemGroup className={cn("overflow-hidden", className)} {...rest} />
);

const MenuItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemGroupLabel>) => (
  <ArkMenu.ItemGroupLabel
    className={cn(
      "flex w-full items-center justify-between p-2 font-medium text-foreground text-sm",
      className,
    )}
    {...rest}
  />
);

const MenuItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemText>) => (
  <ArkMenu.ItemText className={className} {...rest} />
);

const MenuItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemIndicator>) => (
  <ArkMenu.ItemIndicator
    className={cn(
      "ml-auto flex h-3.5 w-3.5 items-center justify-center",
      className,
    )}
    {...rest}
  >
    <Check className="size-4" />
  </ArkMenu.ItemIndicator>
);

const MenuRadioItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.RadioItem>) => (
  <ArkMenu.RadioItem
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.RadioItem>
);

const MenuRadioItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.RadioItemGroup>) => (
  <ArkMenu.RadioItemGroup className={className} {...rest} />
);

const MenuSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Separator>) => (
  <ArkMenu.Separator
    className={cn("-mx-1 mt-1 mb-1 h-px bg-border", className)}
    {...rest}
  />
);

const MenuTriggerItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.TriggerItem>) => (
  <ArkMenu.TriggerItem
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&>svg]:size-4",
      className,
    )}
    {...rest}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ArkMenu.TriggerItem>
);

// TODO: Dicuss passing in an Icon i.e, <Settings /> as children
const MenuItemShortcut = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ark.span>) => (
  <span
    className={cn(
      "ml-auto text-muted-foreground text-xs tracking-widest",
      className,
    )}
    {...rest}
  >
    {children}
  </span>
);

/**
 * @knipignore - Exported for downstream use.
 */
export {
  MenuArrow,
  MenuArrowTip,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuItemText,
  MenuItemIndicator,
  MenuPositioner,
  MenuProvider,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
  MenuItemShortcut,
  PrimitiveMenuIndicator,
};
