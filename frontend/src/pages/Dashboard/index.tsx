import { Button, Stack, TextField } from "@mui/material";
import CustomButton from "@/components/CustomButton";
import CustomInputField from "@/components/CustomInputField";

const Dashboard: React.FC = () => {  
  return(
    <Stack direction="row" spacing={2} alignItems="center">
  <h1>This is dashboard</h1>
  <CustomButton variant="contained">
    Custom Button
  </CustomButton>

  <CustomInputField
    name="check"
    placeholder="Custom input"
    label="Input"
    fullWidth={false}
    size="small"
  />
  <TextField label="email" placeholder="Ener Email" variant="outlined" />

</Stack>

  )
} 
export default Dashboard;