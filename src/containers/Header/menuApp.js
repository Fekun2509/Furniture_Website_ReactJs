export const staffMenu = [
    {
        name: 'menu.admin.users-manage',
        menus: [
            { name: 'menu.admin.sub-menus.users-type.customers', link: '/system/users/customer' },
        ]
    },
    {
        name: 'menu.admin.products-manage',
        menus: [
            { name: 'menu.admin.sub-menus.all-products', link: '/system/all-products' },
            { name: 'menu.admin.sub-menus.products-manage-promotions', link: '/system/products/promotions' },
            // Category submenus sẽ được inject động từ System.js
        ],
    },
];

export const adminMenu = [
    {
        name: 'menu.admin.users-manage',
        menus: [
            { name: 'menu.admin.sub-menus.users-type.administrators', link: '/system/users/admin' },
            { name: 'menu.admin.sub-menus.users-type.staffs',         link: '/system/users/staff' },
            { name: 'menu.admin.sub-menus.users-type.customers',      link: '/system/users/customer' },
        ]
    },

    {
        name: 'menu.admin.products-manage',
        menus: [
            { name: 'menu.admin.sub-menus.all-products', link: '/system/all-products' },
            { name: 'menu.admin.sub-menus.products-manage-promotions', link: '/system/products/promotions' },
            // Category submenus sẽ được inject động từ System.js
        ],
    },

];