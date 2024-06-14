import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography, Link, Box, IconButton } from '@material-ui/core';
import { Facebook, X, Instagram, LinkedIn, YouTube } from '@mui/icons-material';
import apiConfig from "../../api/client/endpoint";

const BASE_URL = apiConfig.BASE_URL;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      position: 'relative',
      background: '#F5FBF5',
      height:"100%"
    },
  })
);

const FooterRenderer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>

      <Grid container spacing={2} justifyContent="center" alignItems="stretch" style={{width:"90%", margin:"auto"}}>
        <Grid container justifyContent='center'  xs={12} sm={9} md={6} lg={5} style={{ paddingTop:"10px"}}>
          <Grid container justifyContent='center' lg={12} >
            <Grid item style={{textAlign:"center"}} lg={3}>
              <img src={`${BASE_URL}images/logo.jpeg`} width="92px" height="55px" style={{transform:"scale(1.5)", marginTop:"20px", marginBottom:"10px"}} />
              <div>
                <Typography variant="h5" style={{ color: '#0D3823', fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 900, textTransform: 'capitalize', wordWrap: 'break-word' }}>
                  Indian Shop<br />
                </Typography>
                <Typography variant="h5" style={{ color: '#FF6600', fontSize: 24, fontFamily: 'Proxima Nova', fontWeight: 400, textTransform: 'capitalize', wordWrap: 'break-word' }}>
                  Milano
                </Typography>
              </div>
            </Grid>
            <Grid item lg={7} style={{marginLeft:"10px"}}>
              <Typography style={{paddingBottom:"20px", paddingRight:"15px"}} align="justify" gutterBottom>
                Involved in the import and distribution of asian/indian food and grocery items of all types in milan, italia ,first indian groceries shop in milan
              </Typography>
              <Grid item  style={{marginBottom:"10px"}} lg={12}>
                <Typography variant="body1" style={{ fontWeight: 900 }}>
                  Address:
                </Typography>
                <Typography variant="body1">
                  Via Panfilo Castaldi, 32, 20124 Milano MI, Italy
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid lg={12}>
          {/* <Box
            style={{ width:"100%", border: "1px solid #1A3F2D" }}
          /> */}
          </Grid>
          
        </Grid>

        <Grid item xs={12} sm={9} md={6} lg={2}>
          {/* <Typography style={{ fontSize: 16, fontFamily: 'Proxima Nova', paddingBottom: 20, fontWeight: 900, }}>Company</Typography> */}
          <Typography style={{ marginBottom: 16, cursor:"pointer" }} >Privacy Policy</Typography>
          <Typography style={{ marginBottom: 16, cursor:"pointer"  }}>Terms of service</Typography>
          <Typography style={{ marginBottom: 16, cursor:"pointer"  }}>Shipping policy</Typography>
          <Typography style={{ marginBottom: 16, cursor:"pointer"  }}>Refund policy</Typography>
          <Typography style={{ marginBottom: 16, cursor:"pointer"  }}>FAQs</Typography>
        </Grid>

        <Grid item xs={12} sm={9} md={6} lg={3}>
          <Typography style={{ marginBottom: 2, fontWeight: 900 }} variant="body1">Delivery partners</Typography>
          <div
          style={{
            display:"flex",
            flexDirection:"row",
            alignItems:"center",
            marginBottom:"24px"
          }}>
            <img src={`${BASE_URL}images/DHL.png`} alt="DHL" style={{ marginRight: 12, width: 50, height: 'auto' }} />
            <img src={`${BASE_URL}images/BRT.png`} alt="BRT" style={{ marginRight: 12, width: 50, height: 'auto' }} />
            <img src={`${BASE_URL}images/PosteItaliane.png`} alt="PosteItaliane" style={{ marginRight: 12, width: 50, height: 'auto' }} />
            <img src={`${BASE_URL}images/SDA.png`} alt="sda" style={{ marginRight: 12, width: 50, height: 'auto' }} />
            {/* Add more logos as needed */}
          </div>
          <Typography style={{ marginBottom: 2, fontWeight: 900 }} variant="body1">Secured Payments</Typography>
          <div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ marginRight: 16, width: 50, height: 50 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" style={{ marginRight: 16, width: 50, height: 50 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ marginRight: 16, width: 50, height: 50 }} />
          </div>
          {/* <Box
            style={{ width:"94%", border: "1px solid #1A3F2D", position:"absolute", bottom:"10px" }}
          /> */}
        </Grid>

        <Grid item xs={12} sm={9} md={6} lg={2} spacing={2}>
          {/* <Typography style={{ fontSize: 16, fontFamily: 'Proxima Nova', paddingBottom: 20, fontWeight: 900, }}>All Categories</Typography> */}
          <Grid item style={{marginBottom:"10px"}}>
            <Typography variant="body1" style={{ fontWeight: 900 }}>
              Follow Us:
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <div style={{ width: 26, height: 26, }} >
                  <X />
                </div>
              </Grid>
              <Grid item>
                <div
                    style={{ width: 26, height: 26, cursor:"pointer" }}
                    onClick={()=>{window.open("https://www.facebook.com/indianshop.milano/?locale=it_IT", '_blank');}}>
                  {/* <IconButton aria-label="facebook" component={Link} to="https://www.facebook.com/indianshop.milano/?locale=it_IT"> */}
                    <Facebook />
                  {/* </IconButton> */}
                </div>
              </Grid>
              <Grid item>
                <div
                    style={{ width: 26, height: 26, cursor:"pointer"}}
                    onClick={()=>{window.open("https://www.instagram.com/indianshop575/", '_blank');}}>
                  <Instagram />
                </div>
              </Grid>
              <Grid item>
                <div style={{ width: 26, height: 26, }} >
                  <YouTube />
                </div>
              </Grid>
              <Grid item>
                <div style={{ width: 26, height: 26, }} >
                  <LinkedIn />
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item  style={{marginBottom:"10px"}}>
            <Typography style={{ fontWeight: 900 }} >Call Us:</Typography>
            <Typography variant="body1"> WhatsApp:  +39 3888578000</Typography>
            <Typography variant="body1">Telephone :  0289656178
            </Typography>
            <Typography variant="body1">Mobile: +39 328 428 8799
            </Typography>
          </Grid>

          <Grid item  style={{marginBottom:"10px"}}>
            <Typography style={{ fontWeight: 900 }}>
              Write Us:
            </Typography>
            <Typography variant="body1">mahomedali30@gmail.com</Typography>
          </Grid>

          
          {/* <Typography></Typography>
          <Typography>Row 4</Typography>
          <Typography>Row 5</Typography> */}
          {/* <Box
            style={{ width:"90%", border: "1px solid #1A3F2D", position:"absolute", bottom:"10px" }}
          /> */}
        </Grid>
        
      </Grid>
      {/* Social Media Links */}
      {/* <Grid container spacing={10} justifyContent="flex-start" alignItems="flex-start" style={{ paddingLeft: 100, paddingRight: 100, paddingBottom: 50 }}>
        <Grid item xs={12} sm={9} md={6} lg={3}>
          
        </Grid>
        <Grid item xs={12} sm={9} md={6} lg={3}>
          
        </Grid>
        <Grid item xs={12} sm={9} md={6} lg={3}>
          
        </Grid>
        <Grid item xs={12} sm={9} md={6} lg={3}>
          
        </Grid>
      </Grid> */}
      <Typography
        variant="body2"
        color="inherit"
        align="center"
        style={{ paddingTop: "16px", height: 38, background: '#438866', textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Proxima Nova', fontWeight: '500', wordWrap: 'break-word' }}
      >
        &copy; {new Date().getFullYear()} © Indian Shop Milano, All rights reserved.    Developed by INFYAIR SRL
      </Typography>
    </footer>
  );
};

export default FooterRenderer;