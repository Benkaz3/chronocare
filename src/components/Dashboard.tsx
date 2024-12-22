import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import Logo from '../assets/logo.svg';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position='relative'>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={Logo}
              alt='ChronoCare Logo'
              style={{
                width: 40,
                height: 40,
                marginRight: 8,
                filter: 'invert(1)',
              }}
            />
            <Typography
              variant='h5'
              sx={{
                fontFamily: 'Playfair, serif',
                fontWeight: 900,
                color: 'white',
                textAlign: 'center',
              }}
            >
              ChronoCare
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth='sm'>
            <Typography
              variant='h2'
              align='center'
              color='text.primary'
              gutterBottom
            >
              Welcome to Chrono Care
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='text.secondary'
              paragraph
            >
              Choose an option below to start tracking your health metrics.
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth='md'>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={6}>
              <Card>
                <CardActionArea
                  onClick={() => handleCardClick('/blood-pressure')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <MonitorHeartIcon color='primary' sx={{ fontSize: 60 }} />
                    <Typography variant='h5' component='div' mt={2}>
                      Huyết Áp
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Ghi lại và theo dõi chỉ số huyết áp: tâm thu, tâm trương
                      và nhịp tim.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card>
                <CardActionArea onClick={() => handleCardClick('/blood-sugar')}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <BloodtypeIcon color='secondary' sx={{ fontSize: 60 }} />
                    <Typography variant='h5' component='div' mt={2}>
                      Đường Huyết
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Ghi lại và theo dõi chỉ số đường huyết của bạn.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default Dashboard;
