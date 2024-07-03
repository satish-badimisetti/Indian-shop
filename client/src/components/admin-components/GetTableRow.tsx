import React,{useState, useEffect} from "react";
import "./inputFields.css";

import { Checkbox, Switch} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

import { calculate, roundOff1 } from "./calculations";
import MultiSelectComponent from "./MultiSelectComponent";

function GetTableRow(props:any){
    const [rowData,setRowData]=useState<any>(props.tableRowData);
    
    const [copyBeforeEdit,setCopyBeforeEdit]=useState<any>([]);
    const fields=props.fieldsData;
    const actions=props.actions;
    const [editState,setEditState]=useState(false);
    const [checked,setChecked]=useState(false);

    useEffect(
        ()=>{
            setRowData(props.tableRowData);
            setCopyBeforeEdit(props.tableRowData);

        },[props.tableRowData]
    )
    useEffect(
        ()=>{
            setChecked(props.checkStatus);
        },[props.checkStatus]
    )
    const getKeyFieldName=()=>{
        let keyField="";
        fields.some(
            (fieldObject:any)=>{
                if(fieldObject.key){
                    keyField=fieldObject.field;
                    return true
                }
            }
        )
        return keyField;
    }
    const onChangeInputField=(e:React.ChangeEvent<any>)=>{
        const fieldName=e.target.name;
        const value=e.target.value;
        setRowData({...rowData,[fieldName]:value});
    }
    const onChangeSwitchInputField=(e:React.ChangeEvent<any>)=>{
        const fieldName=e.target.name;
        const value=e.target.checked? "yes":"no";
        setRowData({...rowData,[fieldName]:value});
    }
    const onMultiSelectChange=(selectedOptions:any,fieldName:any)=>{
        setRowData({...rowData,[fieldName]:selectedOptions});
    }
    const onSaveClick=()=>{
        setCopyBeforeEdit(rowData);
        setEditState(false);
        props.editFreezeFunction(false);
    }
    const onCancelClick=()=>{
        setRowData(copyBeforeEdit);
        setEditState(false);
        props.editFreezeFunction(false)
    }
    const handleCheckClicked=(e:React.ChangeEvent<any>, parentFunction:Function)=>{
        if(e.target.checked){
            parentFunction(rowData[getKeyFieldName()],"checked");
        }
        else{
            parentFunction(rowData[getKeyFieldName()],"not-checked");
        }
    }
    
    return(
        <tr style={{background:`${props.checkStatus?"rgba(250,230,200,0.5)":"white"}`}}>
        {
            Object.keys(rowData).length>0 && (
                <>
                {
                    actions.length>0 && (
                        <td>
                            <div style={{display:"flex", alignItems:"center"}}>
                        {
                            actions.map((action:{action:string,func:Function}, index:any)=>{
                                if(action.action=="edit"){
                                    if(!editState){
                                        return(
                                            <EditIcon
                                                key={index+"edit"}
                                                style={{cursor:"pointer", color:"green"}}
                                                fontSize="small"
                                                onClick={()=>{setEditState(true);props.editFreezeFunction(true)}}
                                            />
                                        )
                                    }
                                    else{
                                        return(
                                            <>
                                                <DoneIcon
                                                    key={index+"done"}
                                                    style={{cursor:"pointer", color:"green"}}
                                                    fontSize="small"
                                                    onClick={()=>{(action.func)(rowData);onSaveClick()}}
                                                />
                                                <CancelIcon 
                                                    key={index+"cancel"}
                                                    style={{cursor:"pointer", color:"red"}}
                                                    fontSize="small"
                                                    onClick={()=>{onCancelClick()}}
                                                />
                                            </>
                                        )
                                    }
                                }
                                else if(action.action=="delete"){
                                    if(!editState){
                                        return(
                                            <DeleteIcon
                                                style={{color:"red", cursor:"pointer"}}
                                                key={index+"delete"}
                                                fontSize="small"
                                                onClick={()=>{(action.func)(rowData)}}
                                            />
                                        )
                                    }
                                }
                                else if(action.action=="check"){
                                    return(
                                        <input
                                            type="checkbox"
                                            // size="small"
                                            style={{ cursor:"pointer"}}
                                            key={index+"check"}
                                            checked={checked}
                                            onChange={(e:any)=>handleCheckClicked(e,action.func)}
                                        />
                                    )
                                } 
                            })
                        }
                            </div>
                        </td>
                    )
                }
                {
                    fields.map(
                        (field:any,index:any)=>{
                            if(field.type=="display"){
                                return (
                                    <td key={index} style={field.style}>{rowData[field.field]}</td>
                                )
                            }
                            else if(field.type=="text"){
                                return (
                                    <td key={index} style={field.style}>
                                        <input
                                            size={field.size?field.size:4}
                                            className="text-input"
                                            type="text"
                                            value={rowData[field.field]}
                                            name={field.field}
                                            onChange={(e)=>onChangeInputField(e)}
                                            disabled={editState? false:true}
                                            
                                        />
                                    </td>
                                )
                            }
                            else if(field.type=="select"){
                                return (
                                    <td key={index} style={field.style}>
                                        <select
                                            className="select-input"
                                            value={rowData[field.field]}
                                            name={field.field}
                                            onChange={(e)=>onChangeInputField(e)}
                                            disabled={editState? false:true}
                                        >
                                            {
                                                field.selectOptions.map(
                                                    (option:any,index:any)=>{
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>)
                                                    }
                                                )
                                            }
    
                                        </select>
                                        
                                    </td>
                                )
                            }
                            else if(field.type=="multiSelect"){
                                return(
                                    <td key={index} style={field.style}>
                                        <MultiSelectComponent 
                                            options={field.selectOptions}
                                            editState={editState}
                                            values={rowData[field.field]}
                                            fieldName={field.field}
                                            onChangeFunction={onMultiSelectChange}
                                        />
                                    </td>
                                )
                                
                            }
                            else if(field.type=="switch"){
                                return(
                                    <td key={index} style={field.style}>
                                        <Switch
                                            size="small"
                                            disabled={editState? false:true}
                                            name={`${field.field}`}
                                            checked={rowData[field.field]=="yes"}
                                            onChange={(e)=>onChangeSwitchInputField(e)}
                                        />
                                    </td>
                                )
                            }
                            else if(field.type=="calc"){
                                const expression=field.calc;
                                const calculatedValue=roundOff1(calculate(expression,rowData));
                                return (
                                    <td key={index} style={field.style}>{calculatedValue}</td>
                                )
                            }
                        }
                    )
                }
                </>
            )
        }
            
            
        </tr>
    )
}
export default React.memo(GetTableRow)