import Link from 'next/link'
import HomeLayout from './home'

const items = [
  {
    label: 'Settings',
    path: '/admin',
  },
  {
    label: 'Storages',
    path: '/admin/storages',
  },
  {
    label: 'Users',
    path: '/admin/users',
  },
]
const AdminLayout = ({ active, title, loading, children }) => {
  return (
    <HomeLayout title={title} loading={loading}>
      <div className="bg-gray-600 w-full px-4 md:px-0">
        <div className="container mx-auto flex justify-center">
          <ul className="flex gap-4">
            {items.map((itm, idx) => (
              <li
                className={`inline h-full py-3 px-4 ${
                  active === itm.label
                    ? 'border-b-4 border-white font-bold text-white'
                    : 'border-b-4 border-transparent text-gray-200'
                }`}
                key={`admin-sub-${idx}`}>
                <Link href={itm.path}>
                  <a className={`hover:opacity-50 duration-300 h-100 `}>
                    {itm.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mx-auto py-8">{children}</div>
    </HomeLayout>
  )
}

export default AdminLayout
