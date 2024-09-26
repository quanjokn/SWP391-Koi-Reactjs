import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProductDetail } from "./screens/ProductDetail";
import { Homepage } from "./screens/Homepage";
import { ProductList } from "./screens/ProductList";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <ProductDetail />,
  },
  {
    path: "/product-detail",
    element: <ProductDetail />,
  },
  {
    path: "/homepage",
    element: <Homepage />,
  },
  {
    path: "/product-list",
    element: <ProductList />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
