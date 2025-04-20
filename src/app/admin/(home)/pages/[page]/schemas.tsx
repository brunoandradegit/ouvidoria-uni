export type Schema = {
  identifier: string;
  type: "string" | "text" | "image";
  label?: string;
  defaultValue?: string;
}[];

const schemas: { [identifier: string]: Schema } = {
  header: [
    {
      identifier: "twitter",
      type: "string",
      label: "Twitter",
      defaultValue: "#",
    },
  ],
};

export default schemas;
