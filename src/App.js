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
      path: 'about',
      element: <About />
    },
    {
      path: 'lien-he',
      element: <Contract />
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
