import React, { type ChangeEvent, useState, useRef, useCallback } from "react";

import { Brush } from "lucide-react";
import { AvatarImage } from "../ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
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

const MAX_FILE_SIZE_MB = 1;

export const AvatarUpload: React.FC<{
  onChange: (filePath: string) => void;
  id: string;
}> = ({ onChange, id }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [fileSizeOverLimit, setFileSizeOverLimit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = api.auth.uploadAvatar.useMutation();

  const handleOndragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault();
    },
    [],
  );

  const readFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadImageToRemote = useCallback(
    async (file: File) => {
      try {
        const dataUrl = await readFileAsDataURL(file);
        const imageUrl = await uploadAvatar.mutateAsync({
          dataUrl,
        });
        console.log("the image url is", imageUrl);
        onChange(imageUrl);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
      }
    },
    [readFileAsDataURL, uploadAvatar, onChange],
  );

  const readAndPreview = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result ?? null);
    };

    reader.readAsDataURL(file);
  }, []);

  const uploadImage = useCallback(
    async (file: File) => {
      const { type } = file;
      if (
        type === "image/png" ||
        type === "image/svg+xml" ||
        type === "image/jpeg" ||
        type === "image/jpg"
      ) {
        try {
          await uploadImageToRemote(file);
          readAndPreview(file);
          return;
        } catch (e) {
          setUploadError(true);
          return;
        }
      }
      setWrongImageType(true);
    },
    [readAndPreview, uploadImageToRemote],
  );

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (file && file.size <= MAX_FILE_SIZE_MB * kiloByte * kiloByte) {
        await uploadImage(file);
        setFileSizeOverLimit(false);
        return;
      }
      setFileSizeOverLimit(true);
    },
    [uploadImage],
  );

  const handleOndrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const imageFile = files?.[0];

        handleFile(imageFile)
          .then(() => {
            setWrongImageType(false);
            setUploadError(false);
          })
          .catch((error) => {
            console.error("Error handling file:", error);
          });
      }
    },
    [handleFile],
  );

  const handleAvatarImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleFile(file);
      }
    },
    [handleFile],
  );

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="flex w-full items-center justify-center">
      <FormItem className="flex flex-col items-center justify-center">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={handleClick} type="button">
              {preview ? (
                <div className=" flex h-full w-full items-center justify-center">
                  <div className="mb-3 flex h-40 w-40 items-center justify-center rounded-full">
                    <Avatar onDragOver={handleOndragOver} onDrop={handleOndrop}>
                      <AvatarImage
                        className="h-40 w-40 rounded-full border-2 object-cover"
                        src={preview}
                      />
                    </Avatar>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleOndragOver}
                  onDrop={handleOndrop}
                  className="mb-3 flex h-40 w-40 items-center justify-center rounded-full border-2 bg-neutral-600"
                >
                  <Image
                    src={"/images/image-plus.png"}
                    priority
                    alt={`logo`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                id={id}
                name={id}
                className="hidden"
                accept=".png, .jpeg, .jpg, .svg"
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarImageChange}
              />

              <div className="flex-column flex w-36 flex-col items-center justify-center rounded bg-black p-2">
                <div className="flex flex-row">
                  <Brush color="white" className=" mr-2 inline h-4 w-4" />
                  <p className="text-sm text-white ">
                    {preview ? "Editar a" : "Adicionar a"}
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
        {wrongImageType && (
          <p className="w-44 text-sm text-red-500">*Tipo de imagem inválido</p>
        )}
        {fileSizeOverLimit && (
          <p className="w-44 text-sm  text-red-500">*Tamanho máximo 1 MB</p>
        )}
        {uploadError && (
          <p className="w-44 text-sm  text-red-500">
            *Erro ao fazer upload do arquivo tente novamente
          </p>
        )}
      </FormItem>
    </div>
  );
};
