import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Outlet />
    </div>
  )
}
