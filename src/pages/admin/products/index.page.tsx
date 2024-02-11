import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";
import { type InferGetServerSidePropsType } from "next";
import { useCallback } from "react";
import { BackofficeHeader } from "~/components/common/headers";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { H1, H2, P } from "~/components/ui/typography";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { api } from "~/utils/api";
import { type ClassNameProps, cn } from "~/utils/ui";
import { initialProducts } from "./initialProducts";
import { useRouter } from "next/router";

export const getServerSideProps = redirectGetServerSideProps.Admin;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProductsScreen({ user }: Props) {
  return (
    <>
      <BackofficeHeader user={user} />
      <div className="p-10">
        <H1 className="text-4xl font-bold">Produtos</H1>
        <ProductsShowcase />
        <DangerZone className="mt-20" />
      </div>
    </>
  );
}

function DangerZone({ className }: ClassNameProps) {
  const router = useRouter();
  const resetProducts = api.product.dangerouslyResetProducts.useMutation();
  const onResetConfirm = useCallback(async () => {
    await resetProducts.mutateAsync(initialProducts);
    router.reload();
  }, [resetProducts, router]);

  return (
    <div
      className={cn(
        "rounded-lg border-4 border-red-700 p-10 shadow-xl",
        className,
      )}
    >
      <H2 className="flex flex-row items-center gap-4 py-0 text-red-950">
        <AlertTriangleIcon size={30} /> Cuidado
      </H2>

      <P className="pb-4 text-xl">
        Essa ação irá resetar{" "}
        <span className="font-bold text-red-900">TODOS</span> os produtos e
        anúncios!!!
      </P>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="gap-3">
            <RotateCcwIcon />
            Resetar Produtos
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-red-600">
            <AlertTriangleIcon className="mb-3" />
            <div className="font-bold">Resetar TODOS os produtos</div>
          </DialogTitle>
          <DialogDescription>Você tem certeza?</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={onResetConfirm} variant="destructive">
                Remover
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductsShowcase() {
  const { data: products, isLoading } = api.product.getAll.useQuery();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!products?.length) {
    return <div>Não existem produtos cadastrados.</div>;
  }

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
