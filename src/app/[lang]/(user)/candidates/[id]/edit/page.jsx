import { Card } from "@mui/material";

import AddCandidateForm from "@/views/AddCandidateForm"

const EditCandidatePage = async (props) => {
  const params = await props.params;
  const id = params.id


  return (
    <Card className='overflow-visible'>
      <AddCandidateForm candidateId={id} />
    </Card>
  )
}

export default EditCandidatePage
