const adminMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/admin/dashboard'
  },
  {
    label: 'Branch',
    icon: 'tabler-user',
    children: [
      {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/admin/branch/list'
      },
      {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/admin/branch/add'
      }
    ]
  },
  {
    label: dictionary['navigation'].user,
    icon: 'tabler-user',
    children: [
      {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/admin/user/list'
      },
      {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/admin/user/add'
      }
    ]
  }
]

export default adminMenuData
