import React, {useState, useEffect} from "react";

import FilterListIcon from '@mui/icons-material/FilterList';

import GetTableRow from "./GetTableRow";

import "./Inventory.css";
import { calculate, roundOff1 } from "./calculations";
import { Button, IconButton, MenuItem, Select, TextField, Modal, Dialog, DialogContent, DialogActions, DialogContentText, Grid } from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

import { useGetProductsAPI, useCategoriesAPI } from "../../api/productsAPI";

interface filterValuesObejct{
    [key:string]:"string"
}

export default function Inventory(){

    const [productFields,setProductFields]=useState([
        {field:"PROD_ID",key:true,title:"Prod Id",type:"display", style:{ width:"50px",textAlign:"center"}},
        {field:"Name",title:"Product Name",type:"display",toolbar:["search"], style:{width:"300px",textAlign:"left"}},
        {field:"Cat_Name",title:"Category Name",type:"display",toolbar:["select","sort"],selectOptions:["Snacks","Milk"], style:{width:"150px",textAlign:"left"}},
        {field:"Brand",title:"Brand",type:"display",toolbar:["select"],selectOptions:["Maggi","Heritage"], style:{width:"125px",textAlign:"left"}},
        {field:"NoofUnits",title:"No of Units",type:"text", size:3, style:{textAlign:"right"}},
        {field:"Units",title:"Units",type:"select",selectOptions:["kg","l","Nos"], toolbar:["select"], style:{textAlign:"right"}},
        {field:"NetWeight",title:"Net Weight",type:"display", style:{textAlign:"right"}},
        {field:"Quantity",title:"Qty.",type:"display", style:{textAlign:"right"}},
        {field:"Price",title:"Price",type:"text", toolbar:["sort"], style:{ textAlign:"right"}},
        {field:"Discount",title:"Disc. %",type:"text", toolbar:["sort"], style:{ textAlign:"center"}},
        {field:"NoOfQuantitiesOnDiscountedPrice",title:"Qty. for Disc.",type:"display", style:{textAlign:"center"}},
        {field:"Labels",title:"Labels",type:"multiSelect",selectOptions:["Best Sellers","New Arrivals","On Sale"],toolbar:["multiselect"], style:{ width:"200px",textAlign:"left"}},
        {field:"DiscountedPrice",title:"Disc. Price",type:"calc",calc:{"multiply":["Price",{"devide":[{"subtract":[100,"Discount"]},100]}]}},
        {field:"PricePerUnitQuantity",title:"Price/Qty.",type:"display",style:{textAlign:"right"}},
        {field:"Product_Visibility",title:"Visibility",type:"switch",toolbar:["select"],selectOptions:["yes","no"]}
    ]);
    const [products,setProducts]=useState([
                    {
                        "PROD_ID":"1234",
                        "Cat_Name":"Snacks",
                        "Name":"Instant Masala Noodles",
                        "Brand":"Maggi",
                        "NoofUnits":"1",
                        "Units":"kg",
                        "NetWeight":"0.56",
                        "Quantity":"50",
                        "Price":"3.77",
                        "Discount":"10",
                        "NoOfQuantitiesOnDiscountedPrice":"23",
                        "Labels":["Best Sellers", "On Sale"],
                        "DiscountedPrice":"3.393",
                        "PricePerUnitQuantity":"6.058",
                        "Product_Visibility":"yes"
                    },
                    {
                        "PROD_ID":"1235",
                        "Cat_Name":"Milk",
                        "Name":"Milk Powder",
                        "Brand":"Heritage",
                        "NoofUnits":"1",
                        "Units":"l",
                        "NetWeight":"0.89",
                        "Quantity":"2",
                        "Price":"3.77",
                        "Discount":"10",
                        "NoOfQuantitiesOnDiscountedPrice":"23",
                        "Labels":["Best Sellers"],
                        "DiscountedPrice":"3.393",
                        "PricePerUnitQuantity":"6.058",
                        "Product_Visibility":"no"
                    },{
                        "PROD_ID":"1236",
                        "Cat_Name":"Milk",
                        "Name":"Milk Packet",
                        "Brand":"Heritage",
                        "NoofUnits":"1",
                        "Units":"l",
                        "NetWeight":"0.89",
                        "Quantity":"2",
                        "Price":"3.77",
                        "Discount":"10",
                        "NoOfQuantitiesOnDiscountedPrice":"23",
                        "Labels":["Best Sellers"],
                        "DiscountedPrice":"3.393",
                        "PricePerUnitQuantity":"6.058",
                        "Product_Visibility":"no"
                    }
                ]);
    
    useEffect(
        ()=>{fetchProducts();},[]
    )
    const fetchProducts=async ()=>{
        const productsReceived=await useGetProductsAPI();
        const categories=await useCategoriesAPI();
        const categoriesObject:any={};
        categories.forEach((category)=>{categoriesObject[category.CAT_ID]=category.CAT_NAME});

        const modifiedProducts=(productsReceived.products).map(
            (product:any)=>{
                return {...product,
                            Discount:Math.round(product.Discount*100),
                            Cat_Name:categoriesObject[product.CAT_ID],
                            Labels:product.Labels.split(","),
                            PricePerUnitQuantity:parseFloat((product.PricePerUnitQuantity)?.toFixed(3)),
                            NetWeight:parseFloat((product.NetWeight)?.toFixed(3)),
                            
                        }
            }
        )
        updateCategoryOptionsInFields(Object.values(categoriesObject));
        setProducts(modifiedProducts);
    }
    const updateCategoryOptionsInFields=(categoriesArray:string[])=>{
        let newArray:any[]=[];
        productFields.forEach(field=>{
            if(field.field==="Cat_Name"){
                newArray.push({...field,selectOptions:categoriesArray})
            }
            else newArray.push(field);
        })
        setProductFields(newArray);
    }
    
    const [productsToShow,SetProductsToShow]=useState<any>([])//products for display => after filter, sort
    const [filterValues,setFilterValues]=useState<filterValuesObejct>({});//object {"filedName":"fieldValue"}-filters applied
    const [keysChecked,setKeysChecked]=useState<any[]>([]);//the values of the key field for which the rows are checked
    const [sortField,setSortField]=useState<any[]>([]);//the field on which sorting is applied latest
    const [editingRows,setEditingRows]=useState(0);//number of rows in edit state
    const [discountUpdateState,setDiscountUpdateState]=useState(false);
    //table pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setPage(newPage);
      };
      const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    //end of pagination
    
    useEffect(
        ()=>{
            updateProductsToShow(filterValues);
        },[products]
    )
    //one key field - for identifying the row object
    const getKeyFieldName=()=>{
        let keyField="";
        productFields.some(
            (fieldObject)=>{
                if(fieldObject.key){
                    keyField=fieldObject.field;
                    return true
                }
            }
        )
        return keyField;
    }
    const keyFieldName=getKeyFieldName();
    //updates rowData based on keyFieldName
    const updateProducts=(rowData:any)=>{
        const keyField=getKeyFieldName();
        setProducts(products.map(
            (product:any)=>{
                if(product[keyField]==rowData[keyField]){
                    return rowData
                }
                return product
            }
        ))
    }
    //editFunction to receive rowdata from getRowTable
    const editFunction=(rowData:any)=>{
        productFields.map(
            (field)=>{
                if(field.type=="calc"){
                    const expression=field.calc;
                    rowData[field.field]=roundOff1(calculate(expression,rowData))
                }
            }
        )
        console.log("save Request for")
        console.log(rowData);
        updateProducts(rowData);
    }
    //deleteFunction to receive rowdata from getRowTable
    const deleteFunction=(rowData:any)=>{
        console.log("delete request for")
        console.log(rowData)
    }
    //checkFunction to received rowdata from getRowTable
    const checkFunction=(keyValue:any,status:"checked" | "not-checked")=>{
        let newArray=[];
        if(status=="checked"){
            newArray=[...keysChecked,keyValue];
        }
        else{
            newArray=keysChecked.filter(value=>value!=keyValue);
        }
        setKeysChecked(newArray);
    }
    //updates filterValuesObject, updates products to show based on new Filters
    const updateFilterValues=(fieldName:any,fieldValue:any)=>{
        const filterValuesObjectNew:filterValuesObejct={...filterValues,[fieldName]:fieldValue};
        setFilterValues(filterValuesObjectNew);
        updateProductsToShow(filterValuesObjectNew);
    }
    const getComparisionType=(field:string)=>{
        let searchType=null;
        productFields.some(
            (fieldObject)=>{
                if(fieldObject.field==field){
                    fieldObject.toolbar?.map(
                        (tool)=>{
                            if(tool=="search") searchType= "search"
                            else if(tool=="select") searchType="select"
                            else if(tool=="multiselect") searchType= "multiselect"
                        }
                    )
                    return true
                }
                else return false
            }
        )
        return searchType
    }
    const popOutKeyValue=(keyValue:any)=>{
        console.log(keyValue);
        setKeysChecked(prev=>prev.filter(key=>key!=keyValue))
    }
    //filters given Array of objects based on given field and value and updates keysChecked 
    const filterArray=(array:any,field:string,value:any)=>{
        const comparisionType=getComparisionType(field);
        if(comparisionType=="search"){
            return array.filter(
                (object:any)=>{
                    // return object[field].indexOf(value) !=-1
                    const result=object[field].toUpperCase().includes(value.toLocaleUpperCase());
                    if(!result) popOutKeyValue(object[keyFieldName]);
                    return result;
                }
            );
        }
        else if(comparisionType=="select"){
            if(value=="all") return array
            return array.filter(
                (object:any)=>{
                    const result=object[field].indexOf(value) !=-1;
                    if(!result) popOutKeyValue(object[keyFieldName]);
                    return result
                }
            )
        }
        else return array
    }
    //updates products to display based on the filtervaluesobject
    const updateProductsToShow=(filterValuesObject:filterValuesObejct, filteredProducts=products)=>{
        Object.keys(filterValuesObject).forEach(
            (field)=>{
                filteredProducts=filterArray(filteredProducts,field,filterValuesObject[field]);
            }
        )
        SetProductsToShow(filteredProducts);
    }
    //returns sorted products based on fieldname and sort order
    const sortTheProducts=(array:any[],field:string, sortOrder:number=0)=>{
        return array.sort((a,b)=>(a[field].localeCompare(b[field]))*sortOrder);
    }
    const onSortClicked=(field:string,sortOrder:number)=>{
        SetProductsToShow((prev:any[])=>sortTheProducts(prev,field,sortOrder));
        setSortField([field,sortOrder]);
    }  
    //updates total no. of editing rows
    const updateEditingRows=(status:boolean)=>{
        if(status) setEditingRows((prev)=>prev+1)
        else setEditingRows((prev)=>prev-1)
    }
    const handleDiscountDivOpen=()=>{
        setDiscountUpdateState(true);
    }
    const handleDiscountDivClose=()=>{
        setDiscountUpdateState(false);
    }
    const updateDiscount=(discount:number)=>{
        const keyFieldName=getKeyFieldName();
        const newProductsArray=
            products.map((productObject:any)=>{
                if(keysChecked.indexOf(productObject[keyFieldName])>-1){
                    let newProductObject={...productObject,"Discount":discount}
                    productFields.map(
                        (field:any)=>{
                            if(field.type=="calc"){
                                const expression=field.calc;
                                newProductObject[field.field]=roundOff1(calculate(expression,newProductObject))
                            }
                        }
                    )
                    return newProductObject;
                }
                else return productObject;
            });
        console.log(newProductsArray);
        setProducts(newProductsArray);
        // updateProductsToShow(filterValues,newProductsArray);
    }
    const actions:{action:string,func:Function}[]=[
        {action:"edit",func:editFunction},
        {action:"delete",func:deleteFunction},
        {action:"check",func:checkFunction}
    ];
    return (
        <div>
            <div
                style={{
                    display:"flex",
                    margin:"10px",
                    gap:"10px",
                    justifyContent:"center",
                    alignContent:"center",
                }}
            >
                <div className="buttonsDiv" style={{flex:1, justifyContent:"center",alignContent:"center"}}>
                    <Button variant="outlined" onClick={handleDiscountDivOpen} disabled={keysChecked.length===0?true:false}>Update Discount</Button>
                </div>
                <TablePagination
                    component="div"
                    count={productsToShow.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            <Dialog
                open={discountUpdateState}
                onClose={handleDiscountDivClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const formJson = Object.fromEntries((formData as any).entries());
                      const discount = formJson.discount;
                      updateDiscount(discount);
                      handleDiscountDivClose();
                    },
                  }}
            >
                <DialogContent>
                    <DialogContentText>
                        Enter Discount to Update for the selected Products:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="discount"
                        name="discount"
                        label="Discount"
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDiscountDivClose}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </DialogActions>  
            </Dialog>

            <div className="productsDisplayDiv">
                
                <table>
                    <thead>
                        <tr>
                            <th style={{width:"100px"}}>
                                Actions
                            </th>
                            {
                                productFields.map(
                                    (field,index)=> {
                                        return (
                                                <th key={index}>
                                                    <div style={{display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"flex-start"}}>
                                                        <div style={{display:"flex",flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                                                            <div style={{flex:1}}>{field.title}</div>
                                                            <div>
                                                                {
                                                                    field.toolbar?.map(
                                                                        (tool,index)=>{
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
                                                                                        onClick={()=>onSortClicked(field.field,targetSortOrder)}
                                                                                        disabled={editingRows>0}
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
                                                                    (tool,index)=>{
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
                                                                                        onChange={(e)=>{updateFilterValues(field.field,e.target.value)}}
                                                                                        disabled={editingRows>0}
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
                                                                                    onChange={(e)=>{updateFilterValues(field.field,e.target.value)}}
                                                                                    sx={{background:"white", marginTop:"5px",width:`${field.style?.width}`,
                                                                                    "& .MuiSelect-select":{
                                                                                        padding:"2px", fontSize:"0.8em"
                                                                                    }
                                                                                    }}
                                                                                    disabled={editingRows>0}
                                                                                >
                                                                                    <MenuItem value={"all"}>All</MenuItem>
                                                                                    {
                                                                                        field.selectOptions?.map(
                                                                                            (option,index)=>{
                                                                                                return (<MenuItem value={option} key={index}>{option}</MenuItem>)
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
                    </thead>
                    <tbody>
                        {
                            productsToShow.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map(
                                (thisProduct:any, index:any)=>{
                                    return(
                                        <GetTableRow
                                            tableRowData={thisProduct}
                                            fieldsData={productFields}
                                            actions={actions}
                                            key={index}
                                            editFreezeFunction={updateEditingRows}
                                            checkStatus={keysChecked.indexOf(thisProduct[keyFieldName])>-1}
                                        />
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}