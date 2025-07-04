// Next Imports
// Component Imports
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

import UserProfile from '@/views/candidate/profile'

const getProfileData = async (id) => {
  // Vars

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const res = await fetch(`${process.env.API_URL}/candidates/${id}/view`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    console.error('profile data fetch failed')

    return [];
  }

  return res.json()
}

const ProfilePage = async (props) => {

  const params = await props.params;
  const id = params.id


  // Vars
  const data = await getProfileData(id)

  return <UserProfile data={data} cities={data?.cities} industries={data?.industries} />
}

export default ProfilePage
