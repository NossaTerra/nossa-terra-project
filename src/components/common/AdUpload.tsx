import React, { type ChangeEvent, useState, useRef, useCallback } from "react";

import { CameraIcon } from "lucide-react";
import { Input } from "../ui/input";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { kiloByte } from "~/utils/constants";
import { api } from "~/utils/api";
import { type UseFormReturn } from "react-hook-form";
import Image from "next/image";

const MAX_FILE_SIZE_MB = 1;

const IMAGE_FILE_TYPES: string[] = [
  "image/png",
  "image/svg+xml",
  "image/jpeg",
  "image/jpg",
];

const adImageFormKey = "adImage";
type AdImageFormKey = typeof adImageFormKey;

type AdFormData<Key extends string = AdImageFormKey> = {
  [K in Key]?: string;
};

interface Props<FormData extends AdFormData> {
  form: UseFormReturn<FormData>;
  adImage?: string;
}

export function AdUpload<FormData extends AdFormData>({
  form: anoyinglyTypedForm,
  adImage,
}: Props<FormData>) {
  // NOTE: the typesafety here is messy because ReactHookForms's
  // internal types, but it is great actually!
  //
  // We are just casting the form to a more specific type
  // The safe constraint was already infered by the generic
  const form = anoyinglyTypedForm as unknown as UseFormReturn<AdFormData>;

  const [error, setError] = useState<ErrorType | null>(null);
  const errorMessage = useErrorMessage(error);

  const uploadAd = api.ad.uploadAd.useMutation();
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(
    null,
  );

  const handleFileChange = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE_MB * kiloByte * kiloByte) {
        return setError(ErrorType.FileSizeOverLimit);
      }

      if (!IMAGE_FILE_TYPES.includes(file.type)) {
        return setError(ErrorType.InvalidImageType);
      }

      const dataUrl = await readFileAsDataURL(file);
      if (!dataUrl) {
        return setError(ErrorType.CantReadFile);
      }

      setLocalImagePreview(dataUrl);
      try {
        const imageUrl = await uploadAd.mutateAsync({
          dataUrl,
        });
        form.setValue(adImageFormKey, imageUrl);

        setError(null);
      } catch (_e) {
        setError(ErrorType.UploadError);
      }
      setLocalImagePreview(null);
    },
    [form, uploadAd],
  );

  const handleOnDrop = useCallback<React.DragEventHandler<HTMLButtonElement>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const file = event.dataTransfer?.files?.item(0);
      if (file) {
        void handleFileChange(file);
      }
    },
    [handleFileChange],
  );

  const handleOnDragOver = useCallback<
    React.DragEventHandler<HTMLButtonElement>
  >((event) => {
    event.preventDefault();
  }, []);

  const onFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.item(0);
      if (file) {
        void handleFileChange(file);
      }
    },
    [handleFileChange],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
    [],
  );

  const imageSource =
    localImagePreview ?? form.watch(adImageFormKey) ?? adImage;

  return (
    <FormField
      control={form.control}
      name="adImage"
      render={({ fieldState }) => (
        <FormItem className="mx-auto mb-2 flex w-full flex-col items-center justify-center md:w-3/5 lg:mr-6">
          <Input
            name={adImageFormKey}
            accept=".png, .jpeg, .jpg, .svg"
            type="file"
            className="hidden"
            onChange={onFileInputChange}
            ref={fileInputRef}
          />
          <button
            onClick={(e) => triggerFileInput(e)}
            onDragOver={handleOnDragOver}
            onDrop={handleOnDrop}
            className="flex cursor-pointer  flex-row items-center gap-2"
          >
            <div className="mb-4 w-56  rounded-lg border-2 border-dashed border-gray-400 p-4 text-center md:w-full lg:mb-0 lg:p-6">
              {imageSource === undefined ? (
                <CameraIcon className="mx-auto h-8 w-8 text-gray-400 md:h-16 md:w-16 lg:mb-2  lg:h-24 lg:w-24 xl:h-36 xl:w-36" />
              ) : (
                <Image
                  alt="logo"
                  height={150}
                  width={150}
                  priority
                  objectPosition=""
                  className={
                    uploadAd.isLoading
                      ? "mx-auto mb-2 h-36 opacity-40"
                      : "mx-auto  mb-2 h-36"
                  }
                  src={imageSource}
                />
              )}
              <div className="hidden text-gray-600 lg:block">
                Arraste arquivos e solte aqui
              </div>
              <div className="mt-4 truncate whitespace-normal text-xs md:p-6 xl:text-sm">
                Buscar no dispositivo
              </div>
            </div>
          </button>
          {errorMessage && (
            <p className="w-44 text-sm text-red-500">{errorMessage}</p>
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}

enum ErrorType {
  InvalidImageType,
  FileSizeOverLimit,
  CantReadFile,
  UploadError,
}

function useErrorMessage(errorType: ErrorType | null) {
  if (errorType === null) {
    return null;
  }

  const errorMap: Record<ErrorType, string> = {
    [ErrorType.InvalidImageType]: "*Tipo de imagem inválido",
    [ErrorType.FileSizeOverLimit]: "*Tamanho máximo 1 MB",
    [ErrorType.CantReadFile]: "*Não foi possível ler o arquivo",
    [ErrorType.UploadError]: "*Erro ao fazer upload do arquivo tente novamente",
  };

  return errorMap[errorType];
}

function readFileAsDataURL(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => resolve(null);
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return resolve(null);
      }
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
}
