declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

type PhoneState =
  | "NOT_SET"
  | "VERIFIED"
  | "UNVERIFIED"
  | "CODE_SENT"
  | "CODE_EXPIRED"
  | "INVALID_CODE"
  | "LIMIT_EXCEEDED"
  | "UNKNOWN";
