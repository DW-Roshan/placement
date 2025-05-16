// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CandidatesListTable from './CandidatesListTable'

const CandidatesList = ({candidatesData}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CandidatesListTable tableData={candidatesData} />
      </Grid>
    </Grid>
  )
}

export default CandidatesList
