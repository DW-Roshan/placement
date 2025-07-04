// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// import CandidatesListTable from './CandidatesListTable'
import JobsListCard from './JobsListCard'

const JobsList = ({jobsData, isCandidate}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <JobsListCard jobs={jobsData} isCandidate={isCandidate} />
      </Grid>
    </Grid>
  )
}

export default JobsList
