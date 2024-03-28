import { Button, buttonVariants } from "~/components/ui/button";
import { api, type MyListing } from "~/utils/api";
import { PriceTag } from "~/components/common/PriceTag";
import { ProductCard } from "~/components/common/ProductCard";
import {
  AlertTriangleIcon,
  BrushIcon,
  MoreVerticalIcon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import { useCallback, useMemo, useState } from "react";
import { EditListingForm, type ListingFormData } from "./EditListingForm";
import { cn, type ClassNameProps } from "~/utils/ui";
import { getDisplayTime } from "~/utils/time";
import toast from "react-hot-toast";

export function ListingCard({
  listing,
  className,
}: { listing: MyListing } & ClassNameProps) {
  const listingTime = new Date(listing.updatedAt);
  const timeString = getDisplayTime(listingTime);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <DeleteListingDialog
        isOpen={isDeleting}
        onOpenChange={setIsDeleting}
        listing={listing}
      />

      <EditListingModal
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        listing={listing}
      />

      <ProductCard
        product={listing.product}
        className={cn("w-full max-w-[28em]", className)}
        footer={
          <>
            <p className="mt-8 flex items-center gap-2">
              <TimerIcon size={20} /> {timeString}
            </p>
            <PriceTag value={Number(listing.price)} className="mt-2" />
          </>
        }
        topRightElement={
          <DropdownMenu>
            <DropdownMenuTrigger
              className= {cn(buttonVariants({ size: "icon", variant: "outline" }), "bg-slate-300 rounded-full border-0")}
            >
              <MoreVerticalIcon  />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <BrushIcon size={20} /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleting(true)}
                className="text-red-900"
              >
                <Trash2Icon size={20} /> Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </>
  );
}

function DeleteListingDialog({
  listing,
  isOpen,
  onOpenChange,
}: {
  listing: MyListing;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const apiUtils = api.useUtils();
  const deleteListing = api.listing.deleteListing.useMutation({
    onSuccess() {
      void apiUtils.listing.getMyListings.invalidate();
    },
    onError: () => {
      toast.error("Erro ao Deletar Anúncio");
    },
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteListing.mutateAsync({ id: listing.id });
      onOpenChange(false);
    } catch {
      console.log("Error while delete listing");
    }
  }, [deleteListing, listing.id, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <AlertTriangleIcon className="mb-3" />
          <div className="font-bold text-red-600">Deletar Anúncio</div>
        </DialogTitle>
        <DialogDescription>
          Você tem certeza que deseja{" "}
          <span className="font-bold text-red-600">Remover</span> seu anúncio?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            isLoading={deleteListing.isLoading}
            variant="destructive"
            onClick={onDelete}
          >
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditListingModal({
  listing,
  isOpen,
  onOpenChange,
}: {
  listing: MyListing;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const apiUtils = api.useUtils();
  const editListing = api.listing.editListing.useMutation({
    onSuccess() {
      void apiUtils.listing.getMyListings.invalidate();
    },
    onError: () => {
      toast.error("Erro ao Editar Anúncio");
    },
  });
  const onSuccess = useCallback(
    async (data: ListingFormData) => {
      try {
        await editListing.mutateAsync({ ...listing, ...data });
        onOpenChange(false);
      } catch {
        console.log("Error while editing listing");
      }
    },
    [editListing, listing, onOpenChange],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keyRefreshForm = useMemo(() => crypto.randomUUID(), [listing, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <div className="font-bold">Editar Anúncio</div>
        </DialogTitle>

        <EditListingForm
          key={keyRefreshForm}
          isLoading={editListing.isLoading}
          product={listing.product}
          listing={listing}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
