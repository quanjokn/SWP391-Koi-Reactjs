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
import OAuthCallback from './page/oauthcallback';
import FeedbackPage from './page/feedback';
import ManageConsignSell from './page/manageConsignSell';
import ManageConsignCare from './page/manageConsignCare';
import ManageConsignSellDetail from './page/manageConsignSellDetail';
import ManageConsignCareDetail from './page/manageConsignCareDetail';
import OrderListConsignCare from './page/orderListConsignCare';
import Dashboard from './page/dashboard';
import Processing from './page/processing';
import ThankYou from './page/thankYou';
import OrderListConsignSell from './page/orderListConsignSell';
import OrderDetailConSignCare from './page/orderListConsignCareDt';
import ProtectedRoute from './component/protectedRoute';
import PrivateRoute from './component/privateRoute';
import OrderDetailConSignSell from './page/orderListConsignSellDt';
import ManageEmployee from './page/manageEmployee';
import BlogManager from './page/manageBlog';
import Review from './page/review';
import History from './page/history';
import CreateVNPay from './page/vnpay';
import ManageProduct from './page/manageProduct';
import ManageFeedback from './page/manageFeedback';


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
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      )
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
      element: (
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      )
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
      path: 'orders',
      element: (
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      )
    },
    {
      path: 'compare',
      element: <ComparePage />
    },
    {
      path: 'order-list',
      element: (
        <ProtectedRoute>
          <OrderList />
        </ProtectedRoute>
      )
    },
    {
      path: '/review/:orderId/:fishId',
      element: (
        <ProtectedRoute>
          <Review />
        </ProtectedRoute>
      )
    },
    {
      path: 'order-list-consign-sell',
      element: (
        <ProtectedRoute>
          <OrderListConsignSell />
        </ProtectedRoute>
      )
    },
    {
      path: 'order-list-consign-care',
      element: (
        <ProtectedRoute>
          <OrderListConsignCare />
        </ProtectedRoute>
      )
    },
    {
      path: 'order-consign-sell/:orderId',
      element: (
        <ProtectedRoute>
          <OrderDetailConSignSell />
        </ProtectedRoute>
      )
    },
    {
      path: 'order-consign-care/:orderId',
      element: (
        <ProtectedRoute>
          <OrderDetailConSignCare />
        </ProtectedRoute>
      )
    },
    {
      path: 'order-detail/:orderId',
      element: (
        <ProtectedRoute>
          <OrderDetail />
        </ProtectedRoute>
      )
    },
    {
      path: 'manage-blog',
      element: (
        <PrivateRoute requiredRole="Staff">
          <BlogManager />
        </PrivateRoute>
      )
    },
    {
      path: 'manage-orders',
      element: (
        <PrivateRoute requiredRole="Staff">
          <ManageOrder />
        </PrivateRoute>
      )
    },
    {
      path: 'manage-orders/:orderId',
      element: (
        <PrivateRoute requiredRole="Staff">
          <ManageOrderDetail />
        </PrivateRoute>
      )
    },
    {
      path: '*',
      element: <ErrorPage />
    },
    {
      path: 'feedback',
      element: (
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/manage-consign-sell',
      element: (
        <PrivateRoute requiredRole="Staff">
          <ManageConsignSell />
        </PrivateRoute>
      )
    },
    {
      path: '/manage-consign-care',
      element: (
        <PrivateRoute requiredRole="Staff">
          <ManageConsignCare />
        </PrivateRoute>
      )
    },
    {
      path: '/manage-consign-sell/:orderId',
      element: (
        <PrivateRoute requiredRole="Staff">
          <ManageConsignSellDetail />
        </PrivateRoute>
      )
    },
    {
      path: '/manage-consign-care/:orderId',
      element: (
        <PrivateRoute requiredRole="Staff">
          <ManageConsignCareDetail />
        </PrivateRoute>
      )
    },
    {
      path: 'process-order',
      element: (
        <PrivateRoute requiredRole="Staff">
          <Processing />
        </PrivateRoute>
      )
    },
    {
      path: 'history',
      element: (
        <PrivateRoute requiredRole="Staff">
          <History />
        </PrivateRoute>
      )
    },
    {
      path: 'thank-you',
      element: <ThankYou />
    },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute requiredRole="Manager">
          <Dashboard />
        </PrivateRoute>
      )
    },
    {
      path: '/nhan-vien',
      element: (
        <PrivateRoute requiredRole="Manager">
          <ManageEmployee />
        </PrivateRoute>
      )
    },
    {
      path: '/quan-li-san-pham',
      element: (
        <PrivateRoute requiredRole="Manager">
          <ManageProduct />
        </PrivateRoute>
      )
    },
    {
      path: '/oauth/callback',
      element: <OAuthCallback />,
    },
    {
      path: '/vnpay/onlinePayment/:type/:userId/:orderId/:vnpayCode/:money',
      element: (
        <ProtectedRoute>
          <CreateVNPay />
        </ProtectedRoute>
      )
    },
    {
      path: '/manage-feedback',
      element:(
        <PrivateRoute requiredRole="Staff">
          <ManageFeedback />
        </PrivateRoute>
      )
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
