'use client';
import FormOccurrence from '@/app/components/Forms/Occurrence';
import { RadioGroup } from '@headlessui/react';
import { Category, Item, Type } from '@prisma/client';
import { useState } from 'react';
import SearchOccurrence from '../Forms/SearchOccurrence';
import InstructionsModal from '../modals/Instructions';

export type NewProps = {
  categories?: Category[];
  items?: Item[];
  types?: Type[];
};

export default function HomePage({ categories, items, types }: NewProps) {
  const [selected, setSelected] = useState();

  const options = [
    {
      name: 'Nova Solicitação',
      id: 0,
    },
    {
      name: 'Visualizar Solicitação',
      id: 1,
    },
  ];

  return (
    <div className="h-full w-full flex  flex-col">
      <InstructionsModal />
      <h1 className="text-center mb-3 font-semibold text-[32px]">
        OUVIDORIA
      </h1>
      <span className="mb-3 text-justify">
        Este é o seu canal direto com a UniEvangelica.
        <br /> Aqui você pode registrar suas reclamações, sugestões de melhoria,
        solicitações, elogios e denúncias. Ao manifestar-se, o anonimato é uma
        das opções que são apresentadas a você. Porém, se optar por
        identificar-se, seus dados serão mantidos no mais absoluto sigilo. Para
        que você possa acompanhar o andamento de sua manifestação, um número de
        protocolo será gerado.
      </span>
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
                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300'
                    : ''
                }
                  ${
                    checked
                      ? 'bg-green-400 bg-opacity-75 text-white'
                      : 'bg-white'
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
                            checked ? 'text-white' : 'text-gray-900'
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
            description: '',
            pictures: [],
            title: '',
          }}
          items={items}
          categories={categories}
          types={types}
        />
      )}
      {selected === 1 && <SearchOccurrence />}
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
