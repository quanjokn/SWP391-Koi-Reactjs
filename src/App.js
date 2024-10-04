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
      element: <Cart /> // Trang giỏ hàng
    },
    {
      path: 'doi-mat-khau',
      element: <ChangePasswordPage />
    },
    {
      path: 'ki-gui-ban-ca',
      element: <ConsignedKoiToSell />
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
