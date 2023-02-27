import { HomeLayout } from '@/layout'

export default function Home() {
  return (
    <HomeLayout title={`Home`}>
      <div className="w-full h-full">
        <h1 className="text-center text-2xl mt-20">
          Welcome to Vedio
        </h1>
      </div>
    </HomeLayout>
  )
}
