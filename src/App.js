import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import LoginForm from './page/login';
import RegisterForm from './page/register';
import Home from './page/home';
import Blog from './page/blog';
import BlogDetail from './page/blog detail';
import ForgotPassword from './page/forgot';
import About from './page/about';
import Contract from './page/contract';
import ProfilePage from './page/profile';
import ProductDetail from './page/productDetail';
import ProductList from './page/productList';
import Cart from './page/cart';
import ChangePasswordPage from './page/changePassword';
import ConsignedKoiToSell from './page/consignKoiToSell';
import ConsignedKoiToCare from './page/consignKoiToCare';
import Orders from './page/orders';
import ConsignOrders from './page/consignOrders';
import ErrorPage from './page/error';
import ComparePage from './page/compare';
import OrderDetail from './page/orderDetail';
import ManageOrder from './page/manageOrder';
import ManageOrderDetail from './page/manageOrderDetail';
import OrderList from './page/orderList';

import FeedbackPage from './page/feedback';
import ManageConsignSell from './page/manageConsignSell';
import ManageConsignCare from './page/manageConsignCare';
import ManageConsignSellDetail from './page/manageConsignSellDetail';
import ManageConsignCareDetail from './page/manageConsignCareDetail';

import Processing from './page/processing';
import ThankYou from './page/thankYou';


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,  // Trang chủ
    },
    {
      path: "login",
      element: <LoginForm />,  // Trang đăng nhập
    },
    {
      path: "register",
      element: <RegisterForm />,  // Trang đăng kí
    },
    {
      path: "tin-tuc",
      element: <Blog />,  // Trang tin tức
    },
    {
      path: "post/:postId",  // Đường dẫn động để lấy chi tiết bài viết
      element: <BlogDetail />,  // Trang chi tiết bài viết
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: 'gioi-thieu',
      element: <About />
    },
    {
      path: 'lien-he',
      element: <Contract />
    },
    {
      path: 'tai-khoan',
      element: <ProfilePage />
    },
    {
      path: 'fish-detail/:productId',
      element: <ProductDetail />
    },
    {
      path: 'fish/fishes-list',
      element: <ProductList />
    },
    {
      path: 'cart',
      element: <Cart /> 
    },
    {
      path: 'doi-mat-khau',
      element: <ChangePasswordPage />
    },
    {
      path: 'ki-gui-ban-ca',
      element: <ConsignedKoiToSell />
    },
    {
      path: 'ki-gui-cham-soc',
      element: <ConsignedKoiToCare />
    },
    {
      path: 'consign-order',
      element: <ConsignOrders />
    },
    {
      path: 'orders' ,
      element: <Orders /> 
    },
    {
      path: 'compare',
      element: <ComparePage /> 
    },
    {
      path: 'order-list',
      element: <OrderList />  
    },
    {
      path: 'order-detail/:orderId',
      element: <OrderDetail />  
    },
    {
      path: 'manage-orders',
      element: <ManageOrder />
    },
    {
      path: 'manage-orders/:orderId',
      element: <ManageOrderDetail />
    },
    {
      path: 'error',
      element: <ErrorPage />
    },
    {
      path: 'feedback',
      element: <FeedbackPage />
    },
    {
      path: '/manage-consign-sell',
      element: <ManageConsignSell />
    },
    {
      path: '/manage-consign-care',
      element: <ManageConsignCare />
    },
    {
      path: '/manage-consign-sell/:orderId',
      element: <ManageConsignSellDetail />
    },
    {
      path: '/manage-consign-care/:orderId',
      element: <ManageConsignCareDetail />
    },
    {
      path: 'process-order',
      element: <Processing />
    },
    {
      path: 'thank-you',
      element: <ThankYou />
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
