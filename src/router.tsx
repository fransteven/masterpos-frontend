import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppLayout from "./layouts/Applayout"
import Dashboardview from "./views/DashboardView"
import ProductView from "./views/products/ProductView"
import CategoryView from "./views/categories/CategoryView"
import LocationView from "./views/locations/LocationView"
import MovementsView from "./views/movements/MovementsView"
import SalesView from "./views/sales/SalesView"
import InventoryView from "./views/inventory/InventoryView"


function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout/>}>
            <Route path="/" element={<Dashboardview/>} index/>
            <Route path="/sales" element={<SalesView/>}/>
            <Route path="/products" element={<ProductView/>}/>
            <Route path="/categories" element={<CategoryView/>}/>
            <Route path="/locations" element={<LocationView/>}/>
            <Route path="/movements" element={<MovementsView/>}/>
            <Route path="/categories" element={<CategoryView/>}/>
            <Route path="/inventory" element={<InventoryView/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Router
