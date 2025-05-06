import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

// Third-party Imports

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function UserGuard({ children, locale }) {
  const session = await getServerSession(authOptions)
  const userType = session.user.userType;

  if(userType !== 'U') {
    redirect(`/not-authorized`);
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
