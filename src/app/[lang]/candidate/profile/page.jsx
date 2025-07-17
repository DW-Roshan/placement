// Next Imports
// Component Imports
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

import UserProfile from '@/views/candidate/profile'

const getProfileData = async () => {
  // Vars

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const data = res.json()

  console.log("data of profile get:", data)

  if (!res.ok) {
    console.error('profile data fetch failed')

    return [];
  }

  return data
}

const ProfilePage = async () => {

  // Vars
  const data = await getProfileData()

  return <UserProfile data={data} cities={data?.cities} industries={data?.industries} />
}

export default ProfilePage
