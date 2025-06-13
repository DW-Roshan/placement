// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// import CandidatesListTable from './CandidatesListTable'
import JobsListCard from './JobsListCard'

const JobsList = ({candidatesData}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <JobsListCard />
      </Grid>
    </Grid>
  )
}

export default JobsList
