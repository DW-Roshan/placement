import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

// Third-party Imports
import { authOptions } from '@/libs/auth';

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'


export default async function AdminGuard({ children, locale }) {
  const session = await getServerSession(authOptions)
  const userType = session.user.userType;

  // console.log('session', session);

  if(userType !== 'A') {
    redirect(`/not-authorized`);
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
