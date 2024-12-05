// component
// import { AdminLayout, HeaderOnly } from '~/components/Layout';

import AdminLayout from '~/components/Layout/AdminLayout';
import HeaderOnly from '~/components/Layout/HeaderOnly';
//pages

import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import ProductDetail from '~/pages/ProductDetail';

import Search from '~/pages/Search';
import HomeAdmin from '~/pages/Admin';

import withAdminAuth from '~/utils/hocs';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import EditProduct from '~/pages/Admin/Product/EditProduct';
import AddProduct from '~/pages/Admin/Product/AddProduct';

import AddCategory from '~/pages/Admin/Category/AddCategory';
import EditCategory from '~/pages/Admin/Category/EditCategory';
import AllBrand from '~/pages/Admin/Brand/Allbrand';
import Addbrand from '~/pages/Admin/Brand/AddBrand';
import EditBrand from '~/pages/Admin/Brand/EditBrand';
import AllCategory from '~/pages/Admin/Category/AllCategory';
import Product from '~/pages/Admin/Product';
import AddDiscountCode from '~/pages/Admin/DiscountCode/addDiscount';
import AllUser from '~/pages/Admin/Users/AllUser';

import EditUser from '~/pages/Admin/Users/EditUsers';
import AddAdmin from '~/pages/Admin/Users/AddUsers';

import Cart from '~/pages/Cart';
import PaymentSuccess from '~/pages/Payment/PaymentSuccess';
import Payment from '~/pages/Payment';
import CategoryDetail from '~/pages/CategoryDetail';
import withAuth from '~/utils/withAuth';
import AllOrderOfUser from '~/pages/Order/AllOrderOfUser';
import Order from '~/pages/Admin/Order/AllOrder';
import AddImage from '~/pages/Admin/Images/AddImage';

const publicRouters = [
    //client
    { path: '/login', component: Login, layout: HeaderOnly },
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: '/product/:productId', component: ProductDetail }, // trang chi tiết sản phẩm
    { path: '/category/:cateId', component: CategoryDetail },
    { path: '/profile', component: Profile },
    { path: '/upload', component: Upload, layout: HeaderOnly },
    // đăng ký dăng nhập
    { path: '/search', component: Search, layout: null },
    { path: '/register', component: Register, layout: HeaderOnly },
    // giở hàng
    { path: '/cart/:userId', component: Cart, layout: HeaderOnly },
    // thống kê đơn hàng
    { path: '/order/all/get', component: withAuth(AllOrderOfUser), layout: HeaderOnly },

    // order
    { path: '/payment/:orderId', component: Payment, layout: HeaderOnly },
    { path: '/payment-success', component: PaymentSuccess, layout: HeaderOnly },

    // admin
    { path: '/admin/home', component: withAdminAuth(HomeAdmin), layout: AdminLayout },
    // user
    { path: '/admin/users', component: withAdminAuth(AllUser), layout: AdminLayout },
    { path: '/admin/users/createadmin', component: withAdminAuth(AddAdmin), layout: AdminLayout },
    { path: '/admin/users/update', component: withAdminAuth(EditUser), layout: AdminLayout },
    // product
    { path: '/admin/product', component: withAdminAuth(Product), layout: AdminLayout },

    { path: '/admin/product/edit/:productId', component: withAdminAuth(EditProduct), layout: AdminLayout }, // trang admin tôi cần vào dc giao diện trang homeadmin
    { path: '/admin/product/add', component: withAdminAuth(AddProduct), layout: AdminLayout },

    // category
    { path: '/admin/category', component: withAdminAuth(AllCategory), layout: AdminLayout },
    { path: '/admin/category/add', component: withAdminAuth(AddCategory), layout: AdminLayout },
    { path: '/admin/category/edit/:categoryId', component: withAdminAuth(EditCategory), layout: AdminLayout },

    // brand
    { path: '/admin/brand', component: withAdminAuth(AllBrand), layout: AdminLayout },
    { path: '/admin/brand/add', component: withAdminAuth(Addbrand), layout: AdminLayout },
    { path: '/admin/brand/edit/:brandId', component: withAdminAuth(EditBrand), layout: AdminLayout },

    //discountcode
    { path: '/admin/discount', component: withAdminAuth(AddDiscountCode), layout: AdminLayout },

    // image
    { path: '/admin/addimage', component: withAdminAuth(AddImage), layout: AdminLayout },
    // quản lý đơn hàng
    { path: '/admin/order/all', component: withAdminAuth(Order), layout: AdminLayout },
];
const privateRouters = [];
export { publicRouters, privateRouters };
