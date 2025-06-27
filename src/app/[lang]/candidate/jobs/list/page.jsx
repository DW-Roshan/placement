import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import JobsList from "@/views/user/jobs/list"

const getJobsData = async () => {
  // Vars
  try {
    // const token = await getCookie('token');

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if(token){

      const res = await fetch(`${process.env.API_URL}/candidate/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if(res.ok){

        const data = await res.json();

        return data;
      } else {

        return [];
      }

    } else{
      return [];
    }

  } catch (error) {
    console.error('Error fetching user data:', error);

    return [];
  }
}

const ListPage = async () => {

  const jobsData = await getJobsData()

  console.log("json data of jobs", jobsData);

  return (
    <JobsList jobsData={jobsData} />
  )
}

export default ListPage
