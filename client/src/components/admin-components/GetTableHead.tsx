//react hooks
import React, {useState} from "react";
//react components
import { Button, IconButton, MenuItem, Select, TextField, Modal, Dialog, DialogContent, DialogActions, DialogContentText, Grid } from "@mui/material";
//other components

//icons
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
//colors
import { green, red, pink } from '@mui/material/colors';
//interfaces
interface componentProps{
    tableFields:any,
    toolbarEnabled:boolean,
    actionFunction:Function
}
interface filterValuesObject{
    [key:string]:"string"
}

const GetTableHead:React.FC<componentProps>=({tableFields, toolbarEnabled, actionFunction})=>{
    const [sortField,setSortField]=useState<any[]>([]);
    const [filterValues,setFilterValues]=useState<filterValuesObject>({})

    const handleCheckClicked=(value:string)=>{
        actionFunction({actionType:"check",value:value});
    }
    const sortButtonClicked=(field:string,sortOrder:number)=>{
        const newSortField=[field,sortOrder]
        
        setSortField(newSortField);
        actionFunction({actionType:"sort",value:newSortField});
    }
    const updateFilters=(fieldName:any,fieldValue:any)=>{
        const filterValuesObjectNew:filterValuesObject={...filterValues,[fieldName]:fieldValue};
        setFilterValues(filterValuesObjectNew);
        actionFunction({actionType:"filter",value:filterValuesObjectNew});
    }
    return(
        <tr>
            <th style={{width:"100px"}}>
                <div>
                    <div>
                        Actions
                    </div>
                    <div>
                        <DoneAllIcon sx={{color:green[500], marginRight:"6px", marginTop:"5px", cursor:"pointer"}} fontSize="small" onClick={()=>{handleCheckClicked("all")}}/>
                        <RemoveDoneIcon sx={{color:pink["A400"], cursor:"pointer"}} fontSize="small"  onClick={()=>{handleCheckClicked("none")}}/>
                    </div>
                </div>
            </th>
            {
                tableFields.map(
                    (field:any,index:any)=> {
                        if(!field.columnVisible){
                            return <></>
                        }
                        return (
                                <th key={index}>
                                    <div style={{display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"flex-start"}}>
                                        <div style={{display:"flex",flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                                            <div style={{flex:1}}>{field.title}</div>
                                            <div>
                                                {
                                                    field.toolbar?.map(
                                                        (tool:any,index:any)=>{
                                                            if(tool=="sort"){
                                                                let targetSortOrder=1;
                                                                let rotateAngle=180;
                                                                let color="white";
                                                                if(sortField[0]==field.field){
                                                                    color="#00ff00";
                                                                    if(sortField[1]==1){
                                                                        targetSortOrder=-1;
                                                                        rotateAngle=0;
                                                                    }
                                                                }
                                                                return(
                                                                    <IconButton
                                                                        key={index}
                                                                        style={{height:"10px", width:"10px", marginLeft:"10px"}}
                                                                        size="medium"
                                                                        onClick={()=>sortButtonClicked(field.field,targetSortOrder)}
                                                                        disabled={!toolbarEnabled}
                                                                    >
                                                                        <FilterListIcon
                                                                            fontSize="small"
                                                                            key={index}
                                                                            style={{color:color, transform:`rotate(${rotateAngle}deg)`}}
                                                                            
                                                                        />
                                                                    </IconButton>
                                                                )
                                                            }
                                                        }
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                field.toolbar?.map(
                                                    (tool:any,index:any)=>{
                                                        if(tool=="search"){
                                                            return (
                                                                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                    <TextField
                                                                        size="small"
                                                                        variant="outlined"

                                                                        sx={{background:"white",marginTop:"5px", borderRadius:"5px",width:`${field.style?.width}`,
                                                                        "& .MuiInputBase-input":{
                                                                            padding:"4px", fontSize:"0.8em"
                                                                        }
                                                                        }}
                                                                        key={index}
                                                                        value={filterValues[field.field]?filterValues[field.field]:""}
                                                                        onChange={(e)=>{updateFilters(field.field,e.target.value)}}
                                                                        disabled={!toolbarEnabled}
                                                                    />
                                                                    <SearchIcon
                                                                        style={{position:"relative", left:"-25px", top:"3px", zIndex:10, color:"black" }}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                        else if(tool=="select"){
                                                            return(
                                                                <Select
                                                                    key={index}
                                                                    size="small"
                                                                    value={filterValues[field.field]?filterValues[field.field]:"all"}
                                                                    onChange={(e)=>{updateFilters(field.field,e.target.value)}}
                                                                    sx={{background:"white", marginTop:"5px",width:`${field.style?.width}`,
                                                                    "& .MuiSelect-select":{
                                                                        padding:"2px", fontSize:"0.8em"
                                                                    }
                                                                    }}
                                                                    disabled={!toolbarEnabled}
                                                                >
                                                                    <MenuItem value={"all"} style={{display:"block", padding:"5px", textAlign:"left"}}>All</MenuItem>
                                                                    {
                                                                        field.selectOptions?.map(
                                                                            (option:any,index:any)=>{
                                                                                return (<MenuItem value={option} key={index}  style={{display:"block", padding:"5px", textAlign:"left"}}>{option}</MenuItem>)
                                                                            }
                                                                        )
                                                                    }
                                                                </Select>
                                                            )
                                                        }
                                                    }
                                                )
                                            }
                                        </div>
                                    </div> 
                                </th>)
                    }
                )
            } 
        </tr>
    )

}
export default React.memo(GetTableHead);