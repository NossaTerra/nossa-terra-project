import { AlertTriangleIcon, PlusIcon } from "lucide-react";
import { type InferGetServerSidePropsType } from "next";
import { BackofficeHeader } from "~/components/common/headers";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { AdType } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { AdTypeLabel } from "~/server/types/ad.type";

import { AdUpload } from "~/pages/backoffice/ads/AdUpload";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { api } from "~/utils/api";
import { Label } from "@radix-ui/react-label";
import { Switch } from "~/components/ui/switch";
import {
  type AdFields,
  useAdSchema,
} from "~/pages/login/LoginRegisterFlow/hooks/useAdSchema";

export const getServerSideProps = redirectGetServerSideProps.Backoffice;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function BackofficeAdsScreen({ user }: Props) {
  const schema = useAdSchema();

  const form = useForm<AdFields>({
    resolver: zodResolver(schema),
  });

  const addNewAd = api.ad.createAd.useMutation({
    onSuccess() {
      void apiUtils.ad.getAll.invalidate();
      form.reset();
    },
  });

  const { data: adsData, isLoading } = api.ad.getAll.useQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = useCallback(
    (event: { target: { value: string } }) => {
      const searchText = event.target.value.toLowerCase();
      setFilterText(searchText);
    },
    [],
  );

  const clearFilterText = useCallback(() => {
    setFilterText("");
  }, []);

  const filteredAdsData = useMemo(
    () =>
      adsData?.filter((ad) => {
        const idMatches = ad.id.toLowerCase().includes(filterText);
        const nameMatches = ad.name.toLowerCase().includes(filterText);
        const linkMatches = ad.link?.toLowerCase().includes(filterText);

        return idMatches || nameMatches || linkMatches;
      }),
    [adsData, filterText],
  );

  const apiUtils = api.useUtils();
  const onSubmit: SubmitHandler<AdFields> = useCallback(
    async (data) => {
      try {
        await addNewAd.mutateAsync({ ...data, isActive: true });
        form.reset();
        setDialogOpen(false);
        toast.success("Novo anúncio criado com sucesso", {
          duration: 1400,
        });
      } catch (e) {
        toast.error("Erro ao criar novo anúncio");
        setDialogOpen(false);
        return new Response(
          JSON.stringify({
            error: "An unknown error occurred",
          }),
          {
            status: 500,
          },
        );
      }
    },
    [addNewAd, form],
  );

  const deleteAd = api.ad.deleteAd.useMutation({
    onSuccess() {
      void apiUtils.ad.getAll.invalidate();
    },
  });

  const onClickDelete = useCallback(
    (id: string) =>
      deleteAd.mutate({
        id,
      }),
    [deleteAd],
  );

  const toggleAdStatus = api.ad.toggleAdStatus.useMutation({
    onSuccess() {
      void apiUtils.ad.getAll.invalidate();
    },
  });

  const onSwitchStatus = useCallback(
    (id: string, newStatus: boolean) =>
      toggleAdStatus.mutate({
        id,
        newStatus,
      }),
    [toggleAdStatus],
  );

  return (
    <>
      <BackofficeHeader user={user} />
      <div className="flex w-full flex-row items-center justify-between px-10">
        <h1 className="text-4xl font-bold">Anúncios</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="p-6 md:p-8" variant="outline">
              <PlusIcon className="h-10 w-10" />
            </Button>
          </DialogTrigger>
          <DialogContent isFullWidth className="w-[90vw] pb-0 pt-4 md:w-[60vw]">
            <DialogHeader>
              <DialogTitle className="h-6 text-center lg:mb-6 lg:text-2xl ">
                Adicionar propaganda
              </DialogTitle>
            </DialogHeader>
            <div className="flex w-full flex-col bg-white md:p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col lg:flex-row"
                >
                  <AdUpload form={form} />
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <FormItem className="mb-4 w-full text-gray-700">
                          <FormLabel
                            className="block text-sm font-medium"
                            htmlFor="name"
                          >
                            Nome da propaganda:
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="mt-3x w-full md:mt-0"
                              placeholder="Nome"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field, fieldState }) => (
                        <FormItem className="mb-4 w-full text-gray-700">
                          <FormLabel
                            className="block text-sm font-medium"
                            htmlFor="link"
                          >
                            Link da propaganda:
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="mt-3x w-full md:mt-0"
                              placeholder="Link"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="mt-1 w-full text-gray-700">
                          <FormLabel
                            className="block text-sm font-medium"
                            htmlFor="type"
                          >
                            Tipo do anúncio
                          </FormLabel>{" "}
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o Tipo de anúncio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(AdType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {AdTypeLabel[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-6 w-full ">
                      Cadastrar
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-8">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex w-full gap-4 pr-8 md:w-[40vw]">
            <Input
              placeholder="Digite ID ou nome ou link..."
              value={filterText}
              onChange={handleFilterChange}
            />
            <Button onClick={clearFilterText}>Limpar</Button>
          </div>
        </header>

        <div className=" overflow-x-auto  rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className=" w-36 py-3 pr-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Imagem
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Nome Propaganda
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Link
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Deletar
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center">
                    Carregando...
                  </td>
                </tr>
              ) : (
                filteredAdsData?.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-100">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="h-30 w-30 flex items-center justify-center overflow-hidden rounded-md bg-gray-200">
                          {ad?.adImage && (
                            <Image
                              src={ad.adImage}
                              alt="Ad Image"
                              height={90}
                              width={90}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{ad.id}</td>
                    <td className="max-w-96 overflow-hidden overflow-ellipsis px-6 py-4">
                      {ad.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {AdTypeLabel[ad.type]}
                    </td>
                    <td className="max-w-80 overflow-hidden overflow-ellipsis px-6 py-4">
                      {ad.link}
                    </td>
                    <td
                      className={`px-6 py-4 ${ad.isActive ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      <Label
                        className="mb-1 flex h-full items-start "
                        htmlFor="status"
                      >
                        {ad.isActive ? "Ativa" : "Inativa "}
                      </Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Switch
                            checked={ad.isActive}
                            className="bg-slate-500"
                            id="status"
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle className="flex flex-row items-center gap-4 ">
                            <div className="font-bold">
                              {ad.isActive ? "Inativar" : "Ativar"} propaganda
                            </div>
                          </DialogTitle>
                          <p className="text-md pb-4">
                            Essa ação irá{" "}
                            <span className="font-bold">
                              {" "}
                              {ad.isActive ? "Inativar" : "Ativar"} essa
                              propaganda{" "}
                            </span>
                            Você tem certeza?
                          </p>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="secondary">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={() =>
                                  onSwitchStatus(ad.id, !ad.isActive)
                                }
                                variant="default"
                              >
                                Confirmar
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="w-fit">
                            Deletar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle className="flex flex-row items-center gap-4 text-red-900">
                            <AlertTriangleIcon className="mb-3" />
                            <div className="font-bold">Deletar propaganda</div>
                          </DialogTitle>
                          <p className="text-md pb-4">
                            Essa ação irá{" "}
                            <span className="font-bold text-red-900">
                              {" "}
                              Deletar essa propaganda{" "}
                            </span>
                            Você tem certeza?
                          </p>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="secondary">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={() => onClickDelete(ad.id)}
                                variant="destructive"
                              >
                                Confirmar
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
