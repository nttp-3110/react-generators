export default (name, type) => {
  const types = {
    curd: "?pageNum=1&pageSize=10&filters={}&sorts={\"updated_at\":\"descend\"}"
  }
  const array = {
    Register: '/auth/register',
    Login: '/auth/login',
    Pages403: '/403',
    Pages404: '/404',
    Pages500: '/500',
    BusinessCRUD: '/crud',
    Home: '/home',
    User: '/user',
    Profile: '/setting/profile',
    Website: '/setting/website',
    Activity: '/activity',
    Product: '/product/list',
    ProductDiscount: '/product/discount',
    ProductOrder: '/product/order',
    Blog: '/blog',
    Page: '/page',
    ManagementTest: '/managementtest'
  }// 💬 generate link to here

  const apis = {
    CheckSlug: '/check-slug',
    Permission: '/permission',
    RolePermission: '/role-permission',
    User: '/user',
    Role: '/role',
    Profile: '/auth',
    Website: '/setting',
    Activity: '/activity',
    Product: '/product',
    ProductBrand: '/product-brand',
    ProductCategory: '/product-category',
    ProductAttribute: '/product-attribute',
    ProductAttributeItem: '/product-attribute-item',
    ProductDiscount: '/product-discount',
    ProductOrder: '/product-order',
    Blog: '/blog',
    BlogCategory: '/blog-category',
    Page: '/page',
    PageMenu: '/page-menu',
    PageSlideshow: '/page-slideshow',
    ManagementTest: '/managementtest'
  }// 💬 generate api to here

  switch(type) {
    case "curd":
      return array[name] + types[type];
    case "api":
      return apis[name];
    default:
      return array[name];
  }
};
