"use client";
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
  FileField,
  TextAreaField,
  TextField,
} from "@/app/components/Utils/OccurrenceFields";
import { RadioGroup } from "@headlessui/react";
import { Category, Item, Student } from "@prisma/client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import Spinner from "../Spinner";

export type FormProps = {
  defaultValues: Values;
  categories?: Category[];
  items?: Item[];
};

type Values = {
  title: string;
  description: string;
  pictures: string[];
  itemId?: number;
  student?: { name: string; email: string; phone: string };
};

export default function FormOccurrence({
  defaultValues,
  categories,
  items,
}: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues,
  });

  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [formStudent, setFormStudent] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);

  if (!categories || !items) {
    return <Spinner />;
  }

  async function onSubmit(values: Values) {
    toast.promise(handleSubmitOccurrence(values), {
      loading: "Saving...",
      success: (
        <div className="font-bold">
          Enviado com sucesso! <br /> Em breve entraremos em contato.
        </div>
      ),
      error: (
        <div className="font-bold">
          Erro ao enviar. <br /> Tente novamente mais tarde.
        </div>
      ),
    });
  }

  async function handleSubmitOccurrence(values: Values) {
    try {
      const data = {
        categoryId: selectedCategory,
        itemId: selectedItem,
        ...values,
      };

      const resp = await fetch(`/api/occurrence`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        throw new Error();
      }
    } catch (error) {
      console.log("Erro", error);
      throw new Error();
    }
  }

  return (
    <div className="h-full w-full flex  flex-col">
      <Toaster />

      <span className="mb-4 font-semibold">Selecione uma categoria</span>
      <RadioGroup
        value={selectedCategory}
        onChange={setSelectedCategory}
        className="mb-4"
      >
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="space-y-2 ">
          {categories.map((category) => (
            <RadioGroup.Option
              key={category.name}
              value={category.id}
              className={({ active, checked }) =>
                `${
                  active
                    ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300"
                    : ""
                }
                  ${
                    checked
                      ? "bg-green-400 bg-opacity-75 text-white"
                      : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium  ${
                            checked ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {category.name}
                        </RadioGroup.Label>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <CheckIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      {selectedCategory && (
        <>
          <span className="mb-4 font-semibold">Selecione o assunto</span>
          <RadioGroup
            value={selectedItem}
            onChange={setSelectedItem}
            className="mb-4"
          >
            <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
            <div className="space-y-2 ">
              {items
                .filter((item) => item.categoryId === selectedCategory)
                .map((item) => (
                  <RadioGroup.Option
                    key={item.id}
                    value={item.id}
                    className={({ active, checked }) =>
                      `${
                        active
                          ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300"
                          : ""
                      }
                ${
                  checked ? "bg-green-400 bg-opacity-75 text-white" : "bg-white"
                }
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                    }
                  >
                    {({ checked }) => (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium  ${
                                  checked ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {item.name}
                              </RadioGroup.Label>
                            </div>
                          </div>
                          {checked && (
                            <div className="shrink-0 text-white">
                              <CheckIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
            </div>
          </RadioGroup>
        </>
      )}
      {selectedItem && (
        <>
          <span className="mb-4 font-semibold">Descreva abaixo</span>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("student.email", { required: true })}
              onBlur={async (e) => {
                try {
                  const resp = await fetch(`/api/students/${e.target.value}`);

                  if (resp.ok) {
                    setStudentData(await resp.json());
                    return;
                  }

                  if (!resp.ok) {
                    if (resp.status === 404) {
                      setFormStudent(true);
                      return;
                    } else {
                      throw new Error("Dead");
                    }
                  }
                } catch (error) {
                  console.log(error);
                  setFormStudent(true);
                } finally {
                  setFormStudent(true);
                }
              }}
              className="flex h-10 w-full rounded-md border border-input bg-white px-1 py-1 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              label={"E-mail"}
            />

            {formStudent && (
              <>
                <TextField
                  label="Nome completo"
                  className="w-full"
                  defaultValue={studentData?.name || ""}
                  {...register("student.name", { required: true })}
                />
                <TextField
                  label="Telefone para contato"
                  className="w-full"
                  defaultValue={studentData?.phone || ""}
                  {...register("student.phone", { required: true })}
                />
                <TextField
                  label="Título"
                  className="w-full"
                  {...register("title", { required: true })}
                />
                <div className="col-span-2">
                  <TextAreaField
                    label="Detalhes"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="col-span-2">
                  <Controller
                    control={control}
                    name="pictures"
                    render={({
                      field: { name, onBlur, onChange, ref, value },
                    }) => (
                      <>
                        <FileField
                          name={name}
                          onBlur={onBlur}
                          onImageUploaded={(filePath: string) =>
                            onChange([...value, filePath])
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-white px-1 py-1 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                          ref={ref}
                          label={"Imagens"}
                          accept="image/png, image/gif, image/jpeg"
                        />

                        {value.map((image) => (
                          <div className="flex items-center gap-3" key={image}>
                            <img src={image} key={image} className="w-24" />
                            <button
                              className="text-red-500"
                              onClick={() =>
                                onChange(value.filter((f) => f !== image))
                              }
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center  mt-3">
                  <button
                    type="submit"
                    className={[
                      "bg-green-500 rounded text-white px-4 py-2 flex items-center",
                      isSubmitting ? "opacity-50" : "",
                    ].join(" ")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <FaSpinner className="animate-spin" />}
                    Enviar
                  </button>
                </div>
              </>
            )}
          </form>
        </>
      )}
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
