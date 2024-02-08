import React, {
  type ChangeEvent,
  useState,
  useRef,
  useCallback,
} from "react";

import { Brush, Loader2Icon } from "lucide-react";
import { Input } from "../ui/input";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { FormItem } from "../ui/form";
import { kiloByte } from "~/utils/constants";
import Image from "next/image";
import { api } from "~/utils/api";
import { type UseFormReturn } from "react-hook-form";

const MAX_FILE_SIZE_MB = 1;

const IMAGE_FILE_TYPES: string[] = [
  "image/png",
  "image/svg+xml",
  "image/jpeg",
  "image/jpg",
];

const avatarFormKey = "avatarImage";
type AvatarFormKey = typeof avatarFormKey;

type AvatarFormData<Key extends string = AvatarFormKey> = {
  [K in Key]?: string;
};

interface Props<FormData extends AvatarFormData> {
  form: UseFormReturn<FormData>;
  userAvatar?: string;
}

export function AvatarUpload<FormData extends AvatarFormData>({
  form: anoyinglyTypedForm,
  userAvatar
}: Props<FormData>) {
  // NOTE: the typesafety here is messy because ReactHookForms's
  // internal types, but it is great actually!
  //
  // We are just casting the form to a more specific type
  // The safe constraint was already infered by the generic
  const form = anoyinglyTypedForm as unknown as UseFormReturn<AvatarFormData>;

  const [error, setError] = useState<ErrorType | null>(null);
  const errorMessage = useErrorMessage(error);

  const uploadAvatar = api.auth.uploadAvatar.useMutation();
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
        const imageUrl = await uploadAvatar.mutateAsync({
          dataUrl,
        });
        form.setValue(avatarFormKey, imageUrl);

        setError(null);
      } catch (_e) {
        setError(ErrorType.UploadError);
      }
      setLocalImagePreview(null);
    },
    [form, uploadAvatar],
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
  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const imageSource = localImagePreview ?? form.watch(avatarFormKey) ?? userAvatar;

  return (
    <FormItem className="flex flex-col items-center justify-center">
      <Input
        name={avatarFormKey}
        accept=".png, .jpeg, .jpg, .svg"
        type="file"
        className="hidden"
        onChange={onFileInputChange}
        ref={fileInputRef}
      />

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger
            onClick={triggerFileInput}
            onDragOver={handleOnDragOver}
            onDrop={handleOnDrop}
            type="button"
            className="flex flex-col items-center gap-2"
          >
            <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 bg-neutral-600">
              {uploadAvatar.isLoading && (
                <Loader2Icon
                  size={60}
                  strokeWidth={3}
                  className="absolute animate-spin text-white"
                />
              )}
              <Image
                alt="logo"
                priority
                className={uploadAvatar.isLoading ? "opacity-40" : ""}
                {...(imageSource
                  ? {
                      src: imageSource,
                      fill: true,
                    }
                  : {
                      src: "/images/image-plus.png",
                      width: 80,
                      height: 80,
                    })}
              />
            </div>

            <div className="flex-column flex w-36 flex-col items-center justify-center rounded bg-black p-2">
              <div className="flex flex-row">
                <Brush color="white" className=" mr-2 inline h-4 w-4" />
                <p className="text-sm text-white ">
                  {imageSource ? "Editar a" : "Adicionar a"}
                </p>
              </div>
              <p className="text-sm text-white ">logo da empresa</p>
            </div>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={-26}
            className="relative mb-2.5 ml-[255px] flex flex-col items-center justify-center overflow-visible rounded bg-backgroundTertiary p-2 md:ml-72 md:px-2 lg:mb-6 lg:p-3"
          >
            <div className="absolute left-2 top-8 h-0 w-0 border-l-[2px] border-r-[16px] border-t-[14px] border-l-transparent border-r-transparent border-t-backgroundTertiary md:top-14 md:border-l-[3px] md:border-r-[15px] md:border-t-[18px] lg:top-20"></div>{" "}
            <p className="font-inter-400 hidden text-xs text-black md:block lg:text-sm ">
              Clique ou arraste e solte
            </p>
            <p className="font-inter-400 hidden text-xs text-black md:block lg:text-sm ">
              Arquivos - MAX 1MB
            </p>
            <p className="font-inter-400 text-xs text-black lg:text-sm">
              (Campo Opcional)
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {errorMessage && (
        <p className="w-44 text-sm text-red-500">{errorMessage}</p>
      )}
    </FormItem>
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
