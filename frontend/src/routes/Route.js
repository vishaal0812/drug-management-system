import ManufacturerList from "../pages/list-pages/ManufacturerList";
import ManufacturerPage from "../pages/detail-pages/ManufacturerPage";
import DrugList from "../pages/list-pages/DrugList";
import DrugPage from "../pages/detail-pages/DrugPage";
import CustomerList from "../pages/list-pages/CustomerList";
import CustomerPage from "../pages/detail-pages/CustomerPage";
import OrderPage from "../pages/detail-pages/OrderPage";
import OrderList from "../pages/list-pages/OrderList";
import DashBoard from "../pages/detail-pages/DashBoard";
import Settings from "../pages/detail-pages/settings/Settings";
import MainPage from "../pages/detail-pages/MainPage";

export const applicationRoutes = [
    {
        path: '/login',
        element: <MainPage/>
    },{
        path: '/dashboard',
        element: <DashBoard/>
    },{
        path: '/manufacturers',
        element: <ManufacturerList/>
    },{
        path: '/manufacturers/:manufacturerId',
        element: <ManufacturerPage/>
    },{
        path: '/drugs',
        element: <DrugList/>
    },{
        path: '/drugs/:drugId',
        element: <DrugPage/>
    },{
        path: '/customers',
        element: <CustomerList/>
    },{
        path: '/customers/:customerId',
        element: <CustomerPage/>
    },{
        path: '/orders',
        element: <OrderList/>
    },{
        path: '/orders/:orderId',
        element: <OrderPage/>
    },{
        path: '/settings/:subPage',
        element: <Settings/>
    },{
        path: '/settings',
        element: <Settings/>
    },{
        path: '/*',
        element: <DashBoard/>
    }
]