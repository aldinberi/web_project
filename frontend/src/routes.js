
import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import Products from "views/Products";
import Coupons from "views/Coupons";
import Stores from "views/Stores";

import ProductsUser from "views/ProductsUser";
import CouponsUser from "views/CouponsUser";
import StoresUser from "views/StoresUser";



const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/products",
    name: "Products",
    icon: "pe-7s-drawer",
    component: Products,
    layout: "/admin"
  },
  {
    path: "/coupons",
    name: "Coupons",
    icon: "pe-7s-ticket",
    component: Coupons,
    layout: "/admin"
  },
  {
    path: "/stores",
    name: "Stores",
    icon: "pe-7s-shopbag",
    component: Stores,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/products",
    name: "Products",
    icon: "pe-7s-drawer",
    component: ProductsUser,
    layout: "/public"
  },
  {
    path: "/coupons",
    name: "Coupons",
    icon: "pe-7s-ticket",
    component: CouponsUser,
    layout: "/public"
  },
  {
    path: "/stores",
    name: "Stores",
    icon: "pe-7s-shopbag",
    component: StoresUser,
    layout: "/public"
  },
];

export default dashboardRoutes;
