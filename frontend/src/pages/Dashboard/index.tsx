import { Stack, Box, Avatar, Typography, Button } from "@mui/material";
import { useState } from "react";
import CustomDropdownField from "@/components/CustomDropdownField";

const Dashboard: React.FC = () => {
  const [value, setValue] = useState<string | null>(null);

  const UserCard = ({
    name,
    email,
    avatar,
    onAdd,
  }: {
    name: string;
    email: string;
    avatar: string;
    onAdd: () => void;
  }) => (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ p: 1, width: "100%" }}
    >
      <Avatar src={avatar} alt={name} />
      <Stack spacing={0.3} flexGrow={1}>
        <Typography variant="body1" fontWeight={600}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {email}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        size="small"
        onClick={(e) => {
          e.stopPropagation(); // prevents option selection when clicking button
          onAdd();
        }}
      >
        Add
      </Button>
    </Stack>
  );

  const handleAddUser = (name: string) => {
    alert(`User Added: ${name}`);
  };

  const testOptions = [
    {
      value: "1",
      label: (
        <UserCard
          name="Amit Sharma"
          email="amit@example.com"
          avatar="https://i.pravatar.cc/100"
          onAdd={() => handleAddUser("Amit Sharma")}
        />
      ),
    },
    {
      value: "2",
      label: (
        <UserCard
          name="Priya Verma"
          email="priya@example.com"
          avatar="https://i.pravatar.cc/101"
          onAdd={() => handleAddUser("Priya Verma")}
        />
      ),
    },
    {
      value: "3",
      label: (
        <UserCard
          name="Rahul Gupta"
          email="rahul@example.com"
          avatar="https://i.pravatar.cc/102"
          onAdd={() => handleAddUser("Rahul Gupta")}
        />
      ),
    },
  ];

  return (
    <Stack spacing={3} sx={{ width: 350, p: 4 }}>
      <h2>Select User (Component Labels)</h2>

      <CustomDropdownField
        label="Users"
        options={testOptions}
        value={value}
        onChange={(v) => setValue(v as string)}
        fullWidth
      />

      <Box>
        <strong>Selected Value: </strong>{value}
      </Box>
    </Stack>
  );
};

export default Dashboard;
