export const adminMenu = [
    { //quản lí người dùng
        name: 'menu.admin.users-manage',

        menus: [
            {
                name: 'menu.admin.sub-menus.users-manage-header',

                subMenus: [
                    { name: 'menu.admin.sub-menus.users-type.administrators', link: '/system/administrators' },
                    { name: 'menu.admin.sub-menus.users-type.staffs', link: '/system/staffs' },
                    { name: 'menu.admin.sub-menus.users-type.customers', link: '/system/customers' },

                ]
            },

        ]
    },

    {
        //Quản lí sản phẩm
        name: 'menu.admin.products-manage',

        menus: [
            {
                name: 'menu.admin.sub-menus.all-products', link: '/system/all-products',
            },
            {
                name: 'menu.admin.sub-menus.products-manage-categories',

                subMenus: [
                    { name: 'menu.admin.sub-menus.products-type.gaming-table', link: '/system/gaming-table' },
                    { name: 'menu.admin.sub-menus.products-type.table-shelf', link: '/system/table-shelf' },
                    { name: 'menu.admin.sub-menus.products-type.gaming-combos', link: '/system/gaming-combos' },

                ]
            },

            {
                name: 'menu.admin.sub-menus.products-new-product', link: '/system/new-product',
            },
            {
                name: 'menu.admin.sub-menus.products-manage-promotions',
            }
        ],


    },

    { //quản lí đơn hàng
        name: 'menu.admin.orders-manage',

        menus: [
            {
                name: 'menu.admin.sub-menus.orders-manage-details',
            },
            {
                name: 'menu.admin.sub-menus.orders-manage-status',
            },

        ]
    },

    { //quản lí bài đăng
        name: 'menu.admin.posts-manage',

        menus: [
            {
                name: 'menu.admin.sub-menus.posts-manage-allPost',
            },
            {
                name: 'menu.admin.sub-menus.posts-manage-newPost',
            },
        ]
    },
];