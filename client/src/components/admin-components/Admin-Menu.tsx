import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@material-ui/core/Divider/Divider';


import { useNavigate } from 'react-router-dom';

import apiConfig from "../../api/client/endpoint";

const BASE_URL = apiConfig.BASE_URL;
//styles
const thisStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuDiv:{
        display:"flex",
        flexDirection:"row",
        padding:"5px",
        margin:"auto",
        background:"#f7f5f5",
        justifyContent:"center",
        alignItems:'center',
        gap:"8px"
    },
    taskBar:{
        display:"flex",
        flexGrow:1,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        gap:"8px",
        
    },
    menuIcon:{
        cursor:"pointer"
    }
  })
);

export default function MenuAppBar() {
  
  const classes=thisStyles();
  const navigate=useNavigate()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick=(target:String)=>{
    navigate(`/admin/${target}`);
    handleClose();
  }
  
  return (
    <div className={classes.menuDiv}>
        <IconButton onClick={handleMenuClick}>
            <MenuIcon />
        </IconButton>
        <div className={classes.taskBar}>
            {/* <img src={`${BASE_URL}images/logo.jpeg`} width="88px" height="50px"/>    */}
            <Typography  onClick={()=>{navigate("/")}} style={{cursor:"pointer"}}>
                INDIAN SHOP
            </Typography>
            <Typography >
                Admin Activities
            </Typography>
        </div>
              <Menu
                id="adminMenu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 40,
                  horizontal: 10,
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                
                <MenuItem onClick={()=>{handleMenuItemClick("inventory")}} >Inventory</MenuItem>
                <MenuItem onClick={()=>{handleMenuItemClick("addproduct")}} >Add Product</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose} style={{margin:0, paddingBlock:"2px"}}>Logout</MenuItem>
              </Menu>
    </div>
  );
}