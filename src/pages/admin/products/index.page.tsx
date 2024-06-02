import {
  AlertTriangleIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { type InferGetServerSidePropsType } from "next";
import { useCallback, useState, useEffect } from "react";
import { BackofficeHeader } from "~/components/common/headers";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
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
import { Input } from "~/components/ui/input";
import { ProductType, type Product, ProductCategory } from "@prisma/client";
import { Separator } from "~/components/ui/separator";
import { ProductCard } from "~/components/common/ProductCard";
import toast from "react-hot-toast";
import {
  ProductSearchColumn,
  ProductSpecificationChooser,
} from "~/components/common/ProductSearchColumn";

export const getServerSideProps = redirectGetServerSideProps.Admin;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProductsScreen({ user }: Props) {
  return (
    <div className="h-dvh overflow-auto">
      <BackofficeHeader user={user} />
      <H1 className="px-10 text-4xl font-bold">Produtos</H1>
      <ProductsShowcase />
      <DangerZone className="mt-20 px-10" />
    </div>
  );
}

function ProductsShowcase() {
  const router = useRouter();
  const selectedProductId = router.query.product;

  const apiUtils = api.useUtils();
  const createProduct = api.product.createProduct.useMutation({
    onSuccess() {
      void apiUtils.product.getAll.invalidate();
    },
    onError: () => {
      toast.error("Erro ao Criar Produto");
    },
  });
  const onClickNewProduct = useCallback(async () => {
    const newProduct = await createProduct.mutateAsync({
      name: "Novo Café",
      mainColor: "brown",
      type: ProductType.CoffeeArabica,
      category: ProductCategory.Pronto,
    });
    await router.push(
      {
        pathname: router.pathname,
        query: { product: newProduct.id },
      },
      undefined,
      { shallow: true },
    );
  }, [router, createProduct]);

  return (
    <>
      <Button onClick={onClickNewProduct} className="mx-10">
        <PlusIcon /> Novo Produto
      </Button>
      <div className="flex flex-row">
        <ProductSearchColumn
          title="Edição de Produtos"
          className={cn("w-full lg:w-[56em]", {
            "hidden lg:block": selectedProductId,
          })}
        />
        <EditProductColumn
          className={cn("px-10", {
            "hidden lg:block": !selectedProductId,
          })}
        />
      </div>
    </>
  );
}

function EditProductColumn({ className }: ClassNameProps) {
  const router = useRouter();
  const selectedProductId = router.query.product;
  const { data: products } = api.product.getAll.useQuery(undefined, {
    onError: () => {
      toast.error("Erro ao Buscar produtos");
    },
  });
  const product = products?.find((product) => product.id === selectedProductId);

  if (!product) {
    return <div className="w-full px-10" />;
  }

  return (
    <div className={cn("sticky top-10 mt-8 h-dvh w-full", className)}>
      <div className="relative max-w-[68em] rounded-xl bg-cardShade p-8 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          asChild
        >
          <Link href="">
            <XIcon />
          </Link>
        </Button>
        <EditProductForm product={product} />
      </div>
    </div>
  );
}

function EditProductForm({ product }: { product: Product }) {
  const [newProduct, setNewProduct] =
    useState<Omit<Product, "id" | "updatedAt">>(product);

  useEffect(() => setNewProduct(product), [product]);

  const apiUtils = api.useUtils();
  const editProduct = api.product.editProduct.useMutation({
    onSuccess() {
      void apiUtils.product.getAll.invalidate();
    },
    onError: () => {
      toast.error("Erro ao Editar Produto");
    },
  });
  const onClickSave = useCallback(async () => {
    await editProduct.mutateAsync({
      id: product.id,
      ...newProduct,
    });
    toast.success("Produto Editado");
  }, [editProduct, product.id, newProduct]);

  return (
    <div>
      <div className="flex flex-row flex-wrap gap-8">
        <div>
          <H2 className="pb-4 pt-2">Produto Atual</H2>
          <ProductCard product={product} />
        </div>
        <div>
          <H2 className="pb-4 pt-2">Produto Novo</H2>
          <ProductCard product={{ id: product.id, ...newProduct }} />
        </div>
      </div>

      <div className="grid grid-cols-[auto,1fr] items-center gap-4 py-8">
        <Label className="text-end font-bold">Nome</Label>
        <Input
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <Label className="w-24 text-end font-bold">Cor Principal</Label>
        <div className="flex flex-row">
          <Input
            className="w-30"
            type="color"
            value={newProduct.mainColor}
            onChange={(e) =>
              setNewProduct({ ...newProduct, mainColor: e.target.value })
            }
          />
          <Input
            value={newProduct.mainColor}
            onChange={(e) =>
              setNewProduct({ ...newProduct, mainColor: e.target.value })
            }
          />
        </div>
        <Label className="w-24 text-end font-bold">Tipo</Label>
        <div className="flex flex-row flex-wrap gap-4">
          <ProductSpecificationChooser
            selectedValue={newProduct}
            onChange={({ category, type }) =>
              setNewProduct({ ...newProduct, category, type })
            }
          />
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex w-full flex-row flex-wrap">
        <div className="flex-1 space-y-4">
          <h2 className="flex flex-row items-center gap-4 py-0 text-lg">
            <SaveIcon size={20} /> Salvar Produto
          </h2>
          <Button onClick={onClickSave}>Salvar</Button>
        </div>
        <div className="flex-1 space-y-4">
          <h2 className="flex flex-row items-center gap-4 py-0 text-lg text-red-950">
            <AlertTriangleIcon size={20} /> Deletar Produto
          </h2>
          <DeleteProductButton product={product} />
        </div>
      </div>
    </div>
  );
}

function DeleteProductButton({ product }: { product: Product }) {
  const apiUtils = api.useUtils();
  const deleteProduct = api.product.deleteProduct.useMutation({
    onSuccess() {
      void apiUtils.product.getAll.invalidate();
    },
    onError: () => {
      toast.error("Erro ao deletar produto");
    },
  });
  const onClickDelete = useCallback(
    () =>
      deleteProduct.mutate({
        id: product.id,
      }),
    [deleteProduct, product.id],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-fit">
          Deletar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex flex-row items-center gap-4 text-red-900">
          <AlertTriangleIcon className="mb-3" />
          <div className="font-bold">Deletar produto</div>
        </DialogTitle>
        <p className="text-md pb-4">
          Essa ação irá resetar{" "}
          <span className="font-bold text-red-900">TODOS</span> os anúncios
          desse produto! Você tem certeza?
          <ProductCard product={product} className="my-8" />
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onClickDelete} variant="destructive">
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DangerZone({ className }: ClassNameProps) {
  const router = useRouter();
  const resetProducts = api.product.dangerouslyResetProducts.useMutation({
    onError: () => {
      toast.error("Erro ao Resetar Produtos");
    },
  });
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
