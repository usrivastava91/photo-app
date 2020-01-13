import React from "react";
import { Switch, Route } from "react-router-dom";
import { IRoute } from "./routes/Route";
import { Routes } from "./routes/Routes";

const App: React.FC = () => {
  const appRoutes: IRoute[] = [...Routes];

  return (
    <Switch>
      {appRoutes.map((route: IRoute, index: Number) => (
        <Route
          key={route.path}
          exact={true}
          path={route.path}
          component={route.component}
        />
      ))}
    </Switch>
  );
};

export default App;
