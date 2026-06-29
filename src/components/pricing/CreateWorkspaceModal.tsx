import { Button } from "@omnidotdev/thornberry/button";
import { useState } from "react";

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/lib/util";

interface Props {
  tierName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, slug: string) => void;
  isLoading?: boolean;
}

/**
 * Modal for creating a new workspace from the pricing page.
 * Collects workspace name and generates slug before checkout.
 */
const CreateWorkspaceModal = ({
  tierName,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const previewSlug = name ? generateSlug(name.trim()) : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Workspace name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 50) {
      setError("Workspace name must be less than 50 characters");
      return;
    }

    setError(null);
    onSubmit(trimmed, generateSlug(trimmed));
  };

  const handleClose = () => {
    onOpenChange(false);
    setName("");
    setError(null);
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={({ open }) => {
        if (!open) handleClose();
      }}
      trapFocus
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace with the{" "}
            <strong className="text-primary">{tierName}</strong> plan.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Workspace Name"
                autoComplete="off"
                autoFocus
              />

              {previewSlug && (
                <p className="text-muted-foreground text-xs">
                  URL: <span className="font-mono">{previewSlug}</span>
                </p>
              )}

              {error && <p className="text-destructive text-xs">{error}</p>}
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={!name.trim() || isLoading}>
                {isLoading ? "Creating..." : "Continue to Checkout"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateWorkspaceModal;
