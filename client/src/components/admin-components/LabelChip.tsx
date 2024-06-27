import React from "react"
import { Chip} from "@mui/material";
export default function LabelChip(props:any){
    const label=props.label;
    const index=props.index;
    const theme=[
        {background:"#ff9900",color:"#000000"},
        {background:"#f59aba",color:"#000000"},
        {background:"#00ff00",color:"#000000"}
    ]
    return(
        <Chip label={label} variant="outlined" size={"small"} style={{margin:"1px",...theme[index], border:"0px"}}/>
    )

}