import { Stack, TextField } from "@mui/material";
import CustomButton from "@/components/CustomButton";
import CustomInputField from "@/components/CustomInputField";
import CustomRadioGroup from "@/components/CustomRadioGroup";

const Dashboard: React.FC = () => {  
  const options = [
    {
      label: "name", value: "irshad"
    },
    {
      label: "age", value: '25'
    }
  ]
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

  {/* <CustomRadioGroup name="role" options={options}  /> */}
</Stack>

  )
} 
export default Dashboard;