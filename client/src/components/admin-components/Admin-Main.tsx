import React from "react";
// components
import AdminMenubar from "./Admin-Menu";
import { Typography } from "@material-ui/core";
import { Outlet } from "react-router-dom";


export default function AdminMain(){
    return (
        <>
            <AdminMenubar />
            <Outlet />
            <Typography
                variant="body2"
                color="inherit"
                align="center"
                style={{ paddingTop: "16px", height: 38, background: '#438866', textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Proxima Nova', fontWeight: '500', wordWrap: 'break-word' }}
            >
                &copy; {new Date().getFullYear()} © Indian Shop Milano, All rights reserved.    Developed by INFYAIR SRL
            </Typography>
        </> 
    )
}