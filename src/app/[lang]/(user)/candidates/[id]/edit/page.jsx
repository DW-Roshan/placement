import AddCandidateForm from "@/views/user/candidates/add/AddCandidateForm"

const EditCandidatePage = async (props) => {
  const params = await props.params;
  const id = params.id

  console.log("id:", id, params)


  return (
    <AddCandidateForm candidateId={id} />
  )
}

export default EditCandidatePage
