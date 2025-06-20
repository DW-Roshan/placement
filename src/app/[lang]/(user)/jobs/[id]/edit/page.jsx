import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import FormAddEditJob from "@/views/user/jobs/add/FormAddEditJob";
import { redirect } from "next/navigation";
import { getLocalizedUrl } from "@/utils/i18n";

const fetchData = async (id, lang) => {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/edit`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json();

  if (!res.ok) {

    redirect(getLocalizedUrl('/jobs/list', lang));
  }

  return data;

}

const EditJobPage = async (props) => {
  const params = await props.params;
  const lang = params.lang;
  const id = params.id
  const data = await fetchData(id, lang);

  return <FormAddEditJob skillsData={data?.skills} jobData={data?.job} locations={data?.locations}/>
}

export default EditJobPage
