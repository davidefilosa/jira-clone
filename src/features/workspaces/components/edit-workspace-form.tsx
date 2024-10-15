"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Workspace } from "../types";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValue: Workspace;
}
export const EditWorkspaceForm = ({
  onCancel,
  initialValue,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { ...initialValue, image: initialValue.imageUrl ?? "" },
  });

  const { mutate, isPending } = useUpdateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    toast.loading("Updating workspace", { id: "UpdateWorkspace" });
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : undefined,
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValue.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
        onError: (error) => console.log(error),
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 spyce-y-0">
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={onCancel ? onCancel : () => router.back()}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-xl font-bold">
          Edit: {initialValue.name}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter workspace name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="Workspace image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG, or JPEG, max 1MB
                        </p>
                        <input
                          className="hidden"
                          accept=".jpg, .png, .jpeg, .svg"
                          type="file"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        <Button
                          onClick={() => inputRef.current?.click()}
                          type="button"
                          variant={"teritrary"}
                          disabled={isPending}
                          size="xs"
                          className="w-fit mt-2"
                        >
                          Upload image
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size={"lg"}
                variant={"secondary"}
                onClick={onCancel}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
