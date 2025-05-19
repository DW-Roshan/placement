// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { MenuProps } from '@/configs/customDataConfig'
import { useSession } from 'next-auth/react'

const TableFilters = ({ setData, tableData }) => {
  // States
  const [industry, setIndustry] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')
  const [industries, setIndustries] = useState(null);
  const [departments, setDepartments] = useState(null);
  const { data: session } = useSession()
  const token = session?.user?.token

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      // if (role && user.role !== role) return false
      // if (plan && user.currentPlan !== plan) return false
      if (status && user.status != status) return false

      return true
    })

    setData(filteredData || [])
  }, [status, tableData, setData])

  useEffect(() => {

    if(!token) return

    const getIndustry = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/industry`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const jsonData = await response.json();

        setIndustries(jsonData?.industries || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIndustries(null);
      }
    }

    getIndustry()
  }, [token])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-industry'
            value={role}
            onChange={e => setIndustry(e.target.value)}
            slotProps={{
              select: { displayEmpty: true, MenuProps }
            }}
          >
            <MenuItem value=''>Select Industry</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-department'
            value={role}
            onChange={e => setDepartment(e.target.value)}
            slotProps={{
              select: { displayEmpty: true, MenuProps }
            }}
          >
            <MenuItem value=''>Select Department</MenuItem>
          </CustomTextField>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e => setRole(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='author'>Author</MenuItem>
            <MenuItem value='editor'>Editor</MenuItem>
            <MenuItem value='maintainer'>Maintainer</MenuItem>
            <MenuItem value='subscriber'>Subscriber</MenuItem>
          </CustomTextField>
        </Grid> */}
        {/* <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-plan'
            value={plan}
            onChange={e => setPlan(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Plan</MenuItem>
            <MenuItem value='basic'>Basic</MenuItem>
            <MenuItem value='company'>Company</MenuItem>
            <MenuItem value='enterprise'>Enterprise</MenuItem>
            <MenuItem value='team'>Team</MenuItem>
          </CustomTextField>
        </Grid> */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='1'>Active</MenuItem>
            <MenuItem value='0'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
