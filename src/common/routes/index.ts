// import ItemIndexPage from '@pages/items';
// import ItemShowPage from '@pages/items/show';

import { Router } from 'framework7/types';

import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';

import SignUpPage from '@pages/users/registrations/new';
import LoginPage from '@pages/users/sessions/new';
import MyPage from '@pages/users/my-page';
// import EditProfilePage from '@pages/users/edit-profile';
// import ChangePassword from '@pages/users/change-password';

import ItemsOnCategoryPage from '@pages/items/items-on-category';
import ItemDetailPage from '@pages/items/item-detail';
import AddItemPage from '@pages/items/add-item';
import AddItemInfoPage from '@pages/items/add-item-info';
import ManageItemsPage from '@pages/items/manage-itmes';
import EditItemPage from '@pages/items/edit-item';
import EditItemInfoPage from '@pages/items/edit-item-info';

import OrderPage from '@pages/orders/order';
import OrderListPage from '@pages/orders/order-list';

// import SelectProdcutPage from '@pages/refunds/select-item';
// import SelectReasonPage from '@pages/refunds/select-reason';
// import SelectSolutionPage from '@pages/refunds/select-solution';
// import RefundListPage from '@pages/refunds/refund-list';

import ShoppingListPage from '@pages/shopping-lists/shopping-list';

// import CreateReviewPage from '@pages/reviews/create-review';
// import ReviewListPage from '@pages/reviews/review-list';

import PostIndexPage from '@pages/posts/index';
import PostShowPage from '@pages/posts/show';
import PostNewPage from '@pages/posts/new';
import PostEditPage from '@pages/posts/edit';

const commonPages = [
  { path: '/', component: HomePage },
  {
    path: '/intro', //
    component: IntroPage,
  },
];

const userPages = [
  {
    path: '/users/sign_up',
    component: SignUpPage,
  },
  {
    path: '/users/sign_in',
    component: LoginPage,
  },
  { path: '/mypage', component: MyPage },
  // { path: '/users/edit-profile', component: EditProfilePage },
  // { path: '/users/change-password', component: ChangePassword },
];

const itemPages = [
  { path: '/items', component: ItemsOnCategoryPage },
  { path: '/items/add', component: AddItemPage },
  { path: '/items/add-info', component: AddItemInfoPage },
  { path: '/items/manage', component: ManageItemsPage },
  { path: '/items/:id', component: ItemDetailPage },
  { path: '/items/:id/edit', component: EditItemPage },
  { path: '/items/:id/edit-info', component: EditItemInfoPage },
];

const orderPages = [
  { path: '/order', component: OrderPage },
  { path: '/orders', component: OrderListPage },
];

const refundPages = [
  // { path: '/orders/:orderItemId/refund/select-item', component: SelectProdcutPage },
  // { path: '/orders/:orderItemId/refund/select-reason', component: SelectReasonPage },
  // { path: '/orders/:orderItemId/refund/select-solution', component: SelectSolutionPage },
  // { path: '/refunds', component: RefundListPage },
];

const listPages = [
  { path: '/shopping-list', component: ShoppingListPage }, //
];

const reviewPages = [
  // { path: '/reviews/write/items/:id', component: CreateReviewPage },
  // { path: '/reviews/items/:id', component: ReviewListPage },
  // { path: '/reviews/add-info', component: AddItemInfoPage },
  // { path: '/reviews/manage', component: ManageItemsPage },
  // { path: '/reviews/:id', component: ItemDetailPage },
  // { path: '/reviews/:id/edit', component: EditItemPage },
  // { path: '/reviews/:id/edit-info', component: EditItemInfoPage },
];

const routes: Router.RouteParameters[] = [
  ...commonPages,
  ...userPages,
  ...itemPages,
  ...listPages,
  ...orderPages,
  ...refundPages,
  ...reviewPages,

  { path: '/posts', component: PostIndexPage },
  { path: '/posts/new', component: PostNewPage },
  { path: '/posts/:id', component: PostShowPage },
  { path: '/posts/:id/edit', component: PostEditPage },
  { path: '(.*)', component: NotFoundPage },
];

// const routes = [
//   { path: '/', component: HomePage },
//   { path: '/users/sign_in', component: LoginPage },
//   { path: '/users/sign_up', component: SignUpPage },
//   { path: '/intro', component: IntroPage },
//   { path: '/mypage', component: MyPage },
//   { path: '/items', component: ItemIndexPage },
//   { path: '/items/:id', component: ItemShowPage },
//   { path: '/posts', component: PostIndexPage },
//   { path: '/posts/new', component: PostNewPage },
//   { path: '/posts/:id', component: PostShowPage },
//   { path: '/posts/:id/edit', component: PostEditPage },
//   { path: '(.*)', component: NotFoundPage },
// ];

export default routes;
