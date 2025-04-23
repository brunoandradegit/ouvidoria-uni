"use client";
import FormOccurrence from "@/app/components/Forms/Occurrence";
import { RadioGroup } from "@headlessui/react";
import { Category, Item } from "@prisma/client";
import { useState } from "react";

export type NewProps = {
  categories?: Category[];
  items?: Item[];
};

export default function HomePage({ categories, items }: NewProps) {
  const [selected, setSelected] = useState();

  const options = [
    {
      name: "Nova Solicitação",
      id: 0,
    },
    {
      name: "Visualizar",
      id: 1,
    },
  ];

  return (
    <div className="h-full w-full flex  flex-col">
      <RadioGroup value={selected} onChange={setSelected} className="mb-4">
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="space-y-2 ">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.name}
              value={option.id}
              className={({ active, checked }) =>
                `${
                  active
                    ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-900"
                    : ""
                }
                  ${
                    checked
                      ? "bg-blue-900 bg-opacity-75 text-white"
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
                          {option.name}
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
      {selected === 0 && (
        <FormOccurrence
          defaultValues={{
            description: "",
            pictures: [],
            title: "",
          }}
          items={items}
          categories={categories}
        />
      )}
      {selected === 1 && "Buscar"}
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
