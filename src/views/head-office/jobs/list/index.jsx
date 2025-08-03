// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// import CandidatesListTable from './CandidatesListTable'
import JobsListCard from './JobsListCard'

const JobsList = ({jobsData, branchData, isCandidate, hideSearch}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <JobsListCard jobs={jobsData} branchData={branchData} isCandidate={isCandidate} hideSearch={hideSearch} />
      </Grid>
    </Grid>
  )
}

export default JobsList
