import React, {useEffect, useState} from 'react';
import validateFields from '../validationModule';
import { TextField, Select, FormControl, InputLabel, MenuItem, FormHelperText, Checkbox, ListItemText, Box, Chip, Button, Autocomplete } from '@mui/material';

export default function FormFieldMUI({fieldObject, setterFunction, errorUpdater}){
    const {fieldName}=fieldObject
    const {fieldLabel}=fieldObject;
    const {fieldType}=fieldObject;
    const {validationSchema}=fieldObject;

    const [errors,setErrors]=useState([]);
    const [fieldValue,setFieldValue]=useState("");
    const [selectedArray,setSelectedArray]=useState([]);
    const [base64String,setbase64String]=useState("");
    const [fileName,setFileName]=useState();

    const handleInputChange=(e)=>{
        const thisValue=e.target.value;
        const fieldName=e.target.name;
        let errorsResulted=validateFields(thisValue,validationSchema);
        setFieldValue(thisValue);
        setErrors(errorsResulted);
        setterFunction({[fieldName]:thisValue});
        errorUpdater(fieldName,errorsResulted.length);
    }
    const handleAutoCompleteChange=(value,fieldName)=>{
        let errorsResulted=validateFields(value,validationSchema);
        setFieldValue(value);
        setErrors(errorsResulted);
        setterFunction({[fieldName]:value});
        errorUpdater(fieldName,errorsResulted.length);
    }
    const handleFileChange = (event) => {
        const targetFile = event.target.files[0];
        
        const fieldName=event.target.name;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Value = reader.result;
            const thisValue=base64Value;
            let errorsResulted=[];
            
            if(targetFile.type!="image/png"){
                errorsResulted.push("choose only png")
            }
            setErrors(errorsResulted);
            setbase64String(thisValue);
            setFileName(targetFile.name)
            setterFunction({[fieldName]:thisValue});
            errorUpdater(fieldName,errorsResulted.length);
        };
        reader.readAsDataURL(targetFile);
    };
    const handleCheckboxChange=(e)=>{
        const thisValue=e.target.value;
        const fieldName=e.target.name;
        const errorsResulted=validateFields(thisValue,validationSchema);
        
        setSelectedArray(thisValue);
        setErrors(errorsResulted);
        
        setterFunction({[fieldName]:thisValue});
        errorUpdater(fieldName,errorsResulted.length);
    }
    const styles={
        formField:{
            'display':'flex',
            'flexDirection':'column',
            'width':'100%',
            'maxWidth':'500px',
            'justifyContent':'center',
            'alignItems':'center',
            'margin':'auto',
        },
        mainInputField:{
            'display':'flex',
            'width':'70%',
            'maxWidth':'300px',
            'justifyContent':'flex-start',
            'alignSelf':'center',
            'margin':'10px 0px',
        },
       
    }
    return(    
        <div style={styles.formField}>
            {fieldName &&
                <>
                        <div style={styles.mainInputField}>
                            {fieldType==="text" &&
                                <TextField
                                    size='small'
                                    error={errors.length>0}
                                    sx={{width:"100%",background:"white"}}
                                    value={fieldValue}
                                    onChange={(e)=>{handleInputChange(e)}}
                                    name={fieldName}
                                    label={`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}
                                    InputLabelProps={{
                                        shrink: true,
                                        style:{color:"green"}
                                      }}
                                    variant="standard"
                                    helperText={errors.join(", ")}
                                />
                            }
                            {fieldType==="textBox" &&
                                <TextField
                                    size='small'
                                    error={errors.length>0}
                                    sx={{width:"100%",background:"white"}}
                                    value={fieldValue}
                                    onChange={(e)=>{handleInputChange(e)}}
                                    name={fieldName}
                                    label={`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}
                                    InputLabelProps={{
                                        shrink: true,
                                        style:{color:"green"}
                                      }}
                                    variant="standard"
                                    multiline
                                    rows={4}
                                    helperText={errors.join(", ")}
                                />
                            }
                            {fieldType==="select" &&
                                <FormControl sx={{ minWidth: 120, width:"100%" }}>
                                    <InputLabel size="small" variant='standard' shrink style={{color:"green"}}>{`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}</InputLabel>
                                    <Select
                                        size="small"
                                        value={fieldValue}
                                        label={`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}
                                        onChange={(e)=>{handleInputChange(e)}}
                                        variant='standard'
                                        name={fieldName}
                                    >
                                        {
                                            fieldObject.options.map(
                                                (thisOption, _id)=>{
                                                    return(<MenuItem value={thisOption.value} key={_id} style={{display:"block",padding:"5px"}}>{thisOption.option}</MenuItem>)
                                                }
                                            )
                                        }
                                        
                                    </Select>
                                    <FormHelperText>{errors.join(", ")}</FormHelperText>
                                </FormControl>
                            }
                            {fieldType==="freeStyleSelect" &&
                                <Autocomplete
                                    freeSolo
                                    disableClearable
                                    options={fieldObject.options}
                                    sx={{width:"100%",background:"white"}}
                                    value={fieldValue}
                                    onChange={(e, newValue)=>{handleAutoCompleteChange(newValue,fieldName)}}
                                    inputValue={fieldValue}
                                    onInputChange={(e, newInputValue) => {
                                        handleAutoCompleteChange(newInputValue, fieldName);
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            size='small'
                                            error={errors.length>0}
                                            
                                            name={fieldName}
                                            label={`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}
                                            InputLabelProps={{
                                                shrink: true,
                                                style:{color:"green"}
                                            }}
                                            variant="standard"
                                            helperText={errors.join(", ")}
                                        />
                                    }
                                />
                                
                            }
                            {fieldType==="selectItems" &&
                                <FormControl sx={{ width: "100%" }} error={errors.length>0}>
                                    <InputLabel size="small" variant='standard' shrink style={{color:"green"}}>{`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}</InputLabel>
                                        <Select
                                            multiple
                                            size="small"
                                            value={selectedArray}
                                            label={`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}
                                            onChange={(e)=>{handleCheckboxChange(e)}}
                                            variant='standard'
                                            name={fieldName}    
                                            renderValue={(selectedArray) =>(
                                                            selectedArray.join(", ")
                                                        // <Box sx={{display:"flex", flexWrap:"wrap", gap:"1px"}}>
                                                        //     {selectedArray.map(
                                                        //         (value)=>{return <Chip key={value} label={value} />}
                                                        //         )
                                                        //     }
                                                        // </Box>
                                                    )}
                                        >
                                            {fieldObject.options.map(
                                                (thisOption, _id) => (
                                                    <MenuItem key={_id} value={thisOption.value} dense style={{display:"block",padding:"5px"}}>
                                                        <div style={{display:"flex", gap:"4px"}}>
                                                            <Checkbox checked={selectedArray.indexOf(thisOption.value) > -1} size="small"/>
                                                            <ListItemText primary={thisOption.option} />
                                                        </div>
                                                    </MenuItem>
                                                    )
                                                )
                                            }
                                        </Select>
                                        <FormHelperText>{errors.join(", ")}</FormHelperText>
                                </FormControl>
                            }

                            {fieldType==="file" &&
                                <div>
                                    <input
                                        style={{ display: 'none' }}
                                        id="file-input"
                                        type="file"
                                        onChange={handleFileChange}
                                        name={fieldName}
                                        accept="image/png"
                                    />
                                    <label htmlFor="file-input">
                                        <Button variant="contained" component="span">
                                            Choose File
                                        </Button>
                                    </label>
                                    <TextField
                                        size='small'
                                        error={errors.length>0}
                                        sx={{width:"100%",background:"white"}}
                                        value={fileName}
                                        label={`${fieldLabel} : ${validationSchema.notEmpty ? "*":""}`}
                                        InputLabelProps={{
                                            shrink: true,
                                            style:{color:"green"}
                                        }}
                                        variant="standard"
                                        helperText={errors.join(", ")}
                                    />
                                </div>
                            }
                            
                        </div>
                </>
            }
        </div>  
    )
}