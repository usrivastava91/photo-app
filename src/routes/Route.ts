import React from "react";

export interface IRoute {
  path: string;
  component: React.ComponentClass<any, any> | React.FunctionComponent<any>;
}
