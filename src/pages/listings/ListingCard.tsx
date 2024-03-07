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
import { useCallback, useState } from "react";
import { EditListingForm, type ListingFormData } from "./EditListingForm";
import { cn, type ClassNameProps } from "~/utils/ui";

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
              className={buttonVariants({ size: "icon", variant: "ghost" })}
            >
              <MoreVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <BrushIcon size={20} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleting(true)}
                className="text-red-900"
              >
                <Trash2Icon size={20} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </>
  );
}

function getDisplayTime(updatedAt: Date) {
  const now = new Date();
  const postDate = new Date(updatedAt);

  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInSeconds < 120) return "feito agora";
  if (diffInMinutes < 60) return `${diffInMinutes} minutos`;
  if (diffInHours === 1) return `1 hora`;
  if (diffInHours < 24) return `${diffInHours} horas`;
  if (diffInDays === 1) return `1 dia`;
  if (diffInDays < 14) return `${diffInDays} dias`;
  if (diffInWeeks < 4) return `${diffInWeeks} semanas`;
  if (diffInMonths === 1) return `1 mês`;
  if (diffInMonths < 7) return `${diffInMonths} meses`;

  return "Há mais de 6 meses";
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
  });

  const onDelete = useCallback(async () => {
    await deleteListing.mutateAsync({ id: listing.id });
    onOpenChange(false);
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
          <Button variant="destructive" onClick={onDelete}>
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
  });

  const onSuccess = useCallback(
    async (data: ListingFormData) => {
      await editListing.mutateAsync({ ...listing, ...data });
      onOpenChange(false);
    },
    [editListing, listing, onOpenChange],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <div className="font-bold">Editar Anúncio</div>
        </DialogTitle>

        <EditListingForm
          product={listing.product}
          listing={listing}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
