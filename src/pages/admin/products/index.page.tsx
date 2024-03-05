import { AlertTriangleIcon, RotateCcwIcon, SearchIcon } from "lucide-react";
import { type InferGetServerSidePropsType } from "next";
import { type ChangeEventHandler, useCallback, useState, useMemo } from "react";
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
import { ProductType, type Product } from "@prisma/client";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import {
  ProductTypeLabel,
  getProductImageSrc,
} from "~/server/types/product.type";
import { ProductCard } from "~/components/common/ProductCard";

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

  const apiUtils = api.useUtils();
  const createProduct = api.product.createProduct.useMutation({
    onSuccess() {
      void apiUtils.product.getAll.invalidate();
    },
  });

  const onClickNewProduct = useCallback(
    () =>
      createProduct.mutate({
        name: "Novo Café",
        mainColor: "brown",
        type: ProductType.CoffeeArabica,
      }),
    [createProduct],
  );

  const [searchString, setSearchString] = useState("");
  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearchString(event.target.value);
    },
    [],
  );

  const filteredProducts = useMemo(
    () =>
      (products ?? []).filter((product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()),
      ),
    [products, searchString],
  );

  return (
    <div>
      <div className="flex max-w-3xl flex-row items-center gap-2 pb-8">
        <SearchIcon /> <Input value={searchString} onChange={onInputChange} />
      </div>
      <Button onClick={onClickNewProduct} className="mb-8">
        Novo Produto
      </Button>

      {isLoading && <p>Carregando...</p>}

      {filteredProducts?.length ? (
        filteredProducts.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))
      ) : (
        <div>Nenhum produto encontrado</div>
      )}
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const { id: _, ...productContent } = product;
  const [newProduct, setNewProduct] = useState(productContent);

  const apiUtils = api.useUtils();
  const editProduct = api.product.editProduct.useMutation({
    onSuccess() {
      void apiUtils.product.getAll.invalidate();
    },
  });
  const onClickSave = useCallback(
    () =>
      editProduct.mutate({
        id: product.id,
        ...newProduct,
      }),
    [editProduct, product.id, newProduct],
  );

  const deleteProduct = api.product.deleteProduct.useMutation({
    onSuccess() {
      void apiUtils.product.getAll.invalidate();
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
    <div className="py-4">
      <Dialog>
        <DialogTrigger asChild>
          <ProductCard
            product={product}
            className="transition-transform duration-300 hover:scale-110 hover:bg-slate-100"
            role="button"
          />
        </DialogTrigger>
        <DialogContent>
          <h1 className="text-lg font-bold">Preview</h1>
          <ProductCard product={{ id: product.id, ...newProduct }} />
          <h1 className="mt-4 text-lg font-bold">Editar Produto</h1>
          <div className="grid grid-cols-[auto,1fr] items-center gap-4">
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
              {Object.values(ProductType).map((type) => (
                <div
                  role="button"
                  key={type}
                  className={cn(
                    "relative flex cursor-pointer gap-4 overflow-hidden rounded-lg border-4 border-slate-200 p-4 pr-14 shadow-xl transition-colors duration-300 hover:bg-slate-200",
                    { "border-slate-800": type === newProduct.type },
                  )}
                  onClick={() => setNewProduct({ ...newProduct, type })}
                >
                  <span>{ProductTypeLabel[type]}</span>
                  <Image
                    priority
                    src={getProductImageSrc(type)}
                    height={60}
                    width={60}
                    alt="marca dágua do produto"
                    className="absolute -bottom-2 -right-2 opacity-90"
                  />
                </div>
              ))}
            </div>
            <div />
            <DialogClose asChild>
              <Button onClick={onClickSave}>Salvar</Button>
            </DialogClose>
          </div>
          <Separator className="my-2" />
          <div>
            <h2 className="flex flex-row items-center gap-4 py-0 text-lg text-red-950">
              <AlertTriangleIcon size={20} /> Deletar Produto
            </h2>
          </div>
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
                <span className="font-bold text-red-900">TODOS</span> os
                anúncios desse produto! Você tem certeza?
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
