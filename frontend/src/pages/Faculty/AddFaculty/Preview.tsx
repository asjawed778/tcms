import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Home,
  Today,
  Work,
  School,
  Badge,
  Assignment,
  Book,
  FamilyRestroom
} from '@mui/icons-material';

// Define TypeScript interfaces for the form data structure
interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface Document {
  name: string;
  documentNumber: string;
  url: string | null;
}

interface Experience {
  organizationName: string;
  designation: string;
  years: string;
}

interface ExpertiseSubject {
  subject: string;
}

interface UserProfileData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  fatherName?: string;
  motherName?: string;
  address?: Address;
  aadhaarNumber?: string;
  dateOfJoining?: string;
  designation?: string;
  qualification?: string;
  photo?: string;
  certificate?: string;
  documents?: Document[];
  experience?: Experience[];
  expertiseSubject?: ExpertiseSubject[];
}

const UserProfilePreview: React.FC<{ userData: UserProfileData }> = ({ userData }) => {
  // Function to safely check if a section has any data to display
  const hasData = (section: any): boolean => {
    if (section === undefined || section === null) return false;
    
    if (typeof section === 'object') {
      if (Array.isArray(section)) {
        return section.length > 0 && section.some(item => 
          item && typeof item === 'object' && Object.values(item).some(val => val !== "" && val !== null)
        );
      }
      return Object.values(section).some(val => val !== undefined && val !== null && val !== "");
    }
    
    return section !== undefined && section !== null && section !== "";
  };

  // Safe access function to prevent undefined errors
  const safeAccess = <T extends object, K extends keyof T>(obj: T | undefined, key: K): T[K] | undefined => {
    return obj ? obj[key] : undefined;
  };

  // Safely check if array items exist
  const hasArrayData = (arr?: any[]): boolean => {
    return !!arr && arr.length > 0;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          User Profile Preview
        </Typography>

        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Profile Header with Photo */}
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={userData?.photo || "/api/placeholder/150/150"}
                  sx={{ width: 100, height: 100, mr: 3, boxShadow: 2 }}
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {userData?.name || 'Name not provided'}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {userData?.designation || 'Designation not provided'}
                  </Typography>
                  {userData?.dateOfJoining && (
                    <Typography variant="body2" color="textSecondary">
                      Joined on: {userData.dateOfJoining}
                    </Typography>
                  )}
                </Box>
                {userData?.qualification && (
                  <Chip 
                    label={userData.qualification} 
                    color="primary" 
                    variant="outlined" 
                    icon={<School />} 
                    sx={{ ml: 'auto' }} 
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} /> Personal Information
                  </Typography>
                  <List dense>
                    {userData?.email && (
                      <ListItem>
                        <ListItemIcon><Email fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Email" secondary={userData.email} />
                      </ListItem>
                    )}
                    {userData?.phoneNumber && (
                      <ListItem>
                        <ListItemIcon><Phone fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Phone" secondary={userData.phoneNumber} />
                      </ListItem>
                    )}
                    {userData?.gender && (
                      <ListItem>
                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Gender" secondary={userData.gender} />
                      </ListItem>
                    )}
                    {userData?.dob && (
                      <ListItem>
                        <ListItemIcon><Today fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Date of Birth" secondary={userData.dob} />
                      </ListItem>
                    )}
                    {userData?.aadhaarNumber && (
                      <ListItem>
                        <ListItemIcon><Badge fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Aadhaar Number" secondary={userData.aadhaarNumber} />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>

              {/* Family Information */}
              {(userData?.fatherName || userData?.motherName) && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <FamilyRestroom sx={{ mr: 1 }} /> Family Information
                    </Typography>
                    <List dense>
                      {userData?.fatherName && (
                        <ListItem>
                          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Father's Name" secondary={userData.fatherName} />
                        </ListItem>
                      )}
                      {userData?.motherName && (
                        <ListItem>
                          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Mother's Name" secondary={userData.motherName} />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                </Grid>
              )}

              {/* Address Information */}
              {userData?.address && hasData(userData.address) && (
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Home sx={{ mr: 1 }} /> Address Information
                    </Typography>
                    <Grid container spacing={2}>
                      {safeAccess(userData.address, 'addressLine1') && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">Address Line 1</Typography>
                          <Typography variant="body1">{userData.address.addressLine1}</Typography>
                        </Grid>
                      )}
                      {safeAccess(userData.address, 'addressLine2') && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">Address Line 2</Typography>
                          <Typography variant="body1">{userData.address.addressLine2}</Typography>
                        </Grid>
                      )}
                      {safeAccess(userData.address, 'city') && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="textSecondary">City</Typography>
                          <Typography variant="body1">{userData.address.city}</Typography>
                        </Grid>
                      )}
                      {safeAccess(userData.address, 'state') && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="textSecondary">State</Typography>
                          <Typography variant="body1">{userData.address.state}</Typography>
                        </Grid>
                      )}
                      {safeAccess(userData.address, 'country') && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="textSecondary">Country</Typography>
                          <Typography variant="body1">{userData.address.country}</Typography>
                        </Grid>
                      )}
                      {safeAccess(userData.address, 'pincode') && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="textSecondary">Pincode</Typography>
                          <Typography variant="body1">{userData.address.pincode}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Professional Experience */}
              {hasArrayData(userData?.experience) && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ mr: 1 }} /> Professional Experience
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Organization</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Years</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userData?.experience?.map((exp, index) => (
                            <TableRow key={index}>
                              <TableCell>{exp.organizationName || 'N/A'}</TableCell>
                              <TableCell>{exp.designation || 'N/A'}</TableCell>
                              <TableCell>{exp.years || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              )}

              {/* Expertise Subjects */}
              {hasArrayData(userData?.expertiseSubject) && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Book sx={{ mr: 1 }} /> Areas of Expertise
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {userData?.expertiseSubject?.map((subject, index) => (
                        subject?.subject ? (
                          <Chip 
                            key={index} 
                            label={subject.subject} 
                            color="secondary" 
                            variant="outlined" 
                            size="small"
                          />
                        ) : null
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Documents */}
              {hasArrayData(userData?.documents) && (
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assignment sx={{ mr: 1 }} /> Documents
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Document Name</TableCell>
                            <TableCell>Document Number</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userData?.documents?.map((doc, index) => (
                            <TableRow key={index}>
                              <TableCell>{doc?.name || 'N/A'}</TableCell>
                              <TableCell>{doc?.documentNumber || 'N/A'}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={doc?.url ? "Uploaded" : "Not Uploaded"} 
                                  color={doc?.url ? "success" : "error"} 
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

// Example usage with your data structure
const FormPreviewPage: React.FC = () => {
  // This would typically come from your form state or API
  const userData: UserProfileData = {
    documents: [
      {
        name: "hjg",
        documentNumber: "",
        url: null
      }
    ],
    experience: [
      {
        designation: "",
        organizationName: "",
        years: ""
      }
    ],
    expertiseSubject: [
      {
        subject: ""
      }
    ]
  };

  return <UserProfilePreview userData={userData} />;
};

export default FormPreviewPage;