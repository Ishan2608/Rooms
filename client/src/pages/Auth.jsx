import React, {useState} from 'react';

// Material UI Components
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Card from "@mui/material/Card";

// Import Custom Component
import LogInForm from "../components/auth/LogInForm"
import SignUpForm from "../components/auth/SignUpForm";

import "../index.css"
import Header from '../components/auth/Header';

const Auth = () => {
  const [value, setTabValue] = useState('1');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="cover-screen center-card">
      <Card
        sx={{
          width: "900px",
          padding: "30px 10px 10px 10px",
          borderRadius: "10px",
        }}
      >
        <Header/>
        <TabContext value={value}>
          <div style={{ borderBottom: 1, borderColor: "divider", display: 'flex', justifyContent: 'center' }}>
            <TabList onChange={handleTabChange} sx={{ width: '100%', maxWidth: '500px' }}>
              <Tab label="Log In" value="1" sx={{ width: '50%' }} />
              <Tab label="Sign Up" value="2" sx={{ width: '50%' }} />
            </TabList>
          </div>

          <TabPanel value="1">
            <LogInForm />
          </TabPanel>
          <TabPanel value="2">
            <SignUpForm />
          </TabPanel>
        </TabContext>
      </Card>
    </div>
  );
}

export default Auth;
