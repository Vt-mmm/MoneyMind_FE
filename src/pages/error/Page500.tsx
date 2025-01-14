import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Button, Container, Typography } from '@mui/material';
//
import images from 'assets';
import { Helmet } from 'components';
import { StyledContent } from './styles';

// ----------------------------------------------------------------------

function Page500() {

  return (
    <>
      <Helmet title="500 Internal Server Error" />

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            {('error.serverTitle')}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>{('error.serverContent')}</Typography>

          <Box
            component="img"
            alt="Server error"
            // src={images.illustrations.server_error}
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/" size="large" color="inherit" variant="contained" component={RouterLink}>
            {('button.goHome')}
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}

export default Page500;
