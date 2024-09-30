//react
import React, {useState, useEffect} from "react"
//mui
import {Grid} from "@mui/material";
//componenets
import Form from "../../formComponent/Form"
//apis
import { useAddProductAPI, useGetAllCategoriesAPI, useGetAllBrandsAPI } from "../../../api/productsAPI";

//interfaces
interface option{
    "option":string;
    "value":string | number | undefined;
}

export default function AddProduct(){
    const title="Add Product";
    const [categories,setCategories]=useState([]);
    const [brands,setBrands]=useState([]);
    const [successMessage,setSuccessMessage]=useState("");
    const [errorMessage,setErrorMessage]=useState("");
    const [fieldsArray,setFieldsArray]=useState([
        {
            fieldName:"Name",
            fieldLabel:"Product Name",
            fieldType:"text",
            validationSchema:{
                notEmpty:true,
                required:true,
                pattern:{
                    value:/^[a-zA-Z0-9 \-()]*$/,
                    errorMessage:"special characters are not allowed"
                }
            }
        },
        {
            fieldName:"CAT_NAME",
            fieldLabel:"Category Name",
            fieldType:"freeStyleSelect",
            options:[{option:"Snacks",value:"Snacks"},{option:"Milk",value:"Milk"}],
            validationSchema:{
                notEmpty:true,
                required:true,
                pattern:{
                    value:/^[a-zA-Z0-9 \-()]*$/,
                    errorMessage:"special characters are not allowed"
                }
            }
        },
        {
            fieldName:"Brand",
            fieldLabel:"Brand Name",
            fieldType:"freeStyleSelect",
            options:[{option:"Maggi",value:"Maggi"},{option:"Heritage",value:"Heritage"}],
            validationSchema:{
                notEmpty:true,
                required:true,
                pattern:{
                    value:/^[a-zA-Z0-9 \-()]*$/,
                    errorMessage:"special characters are not allowed"
                }
            }
        },
        {fieldName:"NoofUnits", fieldLabel:"No. of Units", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true, pattern:{value:/^\d+$/,errorMessage:"Expect only Integers"}}},
        {fieldName:"Units", fieldLabel:"Units (Kg, L, EA etc.)", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^[a-zA-Z]*$/,errorMessage:"Allowed only alphabets"}}},
        {fieldName:"UnitWeight", fieldLabel:"Unit Weight", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^\d+(\.\d{2})?$/,errorMessage:"allowed upto two decimals only"}}},
        {fieldName:"NetWeight", fieldLabel:"Net Weight", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^\d+(\.\d{2})?$/,errorMessage:"allowed upto two decimals only"}}},
        {fieldName:"Quantity", fieldLabel:"Quantity", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^\d+$/,errorMessage:"Expect only Integers"}}},
        {fieldName:"Price", fieldLabel:"Price (€)", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^\d+(\.\d{2})?$/,errorMessage:"enter upto two decimals"}}},
        {fieldName:"Discount", fieldLabel:"Discount (%)", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^\d+(\.\d{2})?$/,errorMessage:"enter upto two decimals"}}},
        {fieldName:"NoOfQuantitiesOnDiscountedPrice", fieldLabel:"Qt. for Discount", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^\d+$/,errorMessage:"Expect only Integers"}}},
        {fieldName:"VISIBILITY", fieldLabel:"Product Visibility", fieldType:"select", options:[{option:"YES",value:"YES"},{option:"NO",value:"NO"}], validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true}},
        {fieldName:"Labels", fieldLabel:"Labels", fieldType:"selectItems", options:[{option:"Bestsellers",value:"Bestsellers"},{option:"New arrivals",value:"New arrivals"},{option:"On sale",value:"On Sale"}], validationSchema:{notEmpty:{value:true,errorMessage:"input can't be empty"}}},
        {fieldName:"DietaryInfo", fieldLabel:"Dietary Info. (separated with , )", fieldType:"text", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},pattern:{value:/^[a-zA-Z0-9, ]*$/,errorMessage:"special chars are not allowed except , and space"}}},
        {fieldName:"Description", fieldLabel:"Description", fieldType:"textBox", validationSchema:{notEmpty:{errorMessage:"input can't be empty"},required:true,pattern:{value:/^[a-zA-Z0-9, ]*$/,errorMessage:"special chars are not allowed except , and space"}}},
        {fieldName:"productImage", fieldLabel:"Product Image", fieldType:"file", validationSchema:{notEmpty:{errorMessage:"please select file"},required:true}}
    ]);
    useEffect(()=>{
        initiateFieldsArray();
    },[categories, brands]);
    useEffect(()=>{
        fetchCategories();
        fetchBrands();
    },[]);
    const fetchCategories=async ()=>{
        const response=await useGetAllCategoriesAPI();
        const newCategories=response.data.categories;
        setCategories(newCategories.sort((a:any,b:any)=>a.CAT_NAME.localeCompare(b.CAT_NAME)));
    }
    const fetchBrands=async ()=>{
        const newBrands=await useGetAllBrandsAPI();
        setBrands(newBrands);
    }
    const initiateFieldsArray=async ()=>{
        let categoriesOptions:any[]=[];
        categories.forEach((categoryObject:any)=>{
            // categoriesOptions.push({"label":categoryObject.CAT_NAME,"id":categoryObject.CAT_ID});
            categoriesOptions.push(categoryObject.CAT_NAME);
        });
        const newFieldsObjectArray=fieldsArray.map((fieldObject:any)=>{
            if(fieldObject.fieldName=="CAT_NAME"){
                const newObject={...fieldObject,"options":categoriesOptions};
                return newObject;
            }
            else if(fieldObject.fieldName=="Brand"){
                const newObject={...fieldObject,"options":[...brands]};
                return newObject;
            }
            else return fieldObject;
        });
        setFieldsArray(newFieldsObjectArray);
    }
    const getCatId=(catName:string)=>{
        let catId="";
        categories.some((categoryObject:any)=>{
            if(categoryObject.CAT_NAME==catName) catId=categoryObject.CAT_ID;
            return true;
        })
        return catId;
    }
    const submitHandler=async (data:any)=>{
        const discount=Math.round(100*data.Discount/100)/100;
        const price=data.Price;
        const discountedPrice=Math.round(price*(1-discount)*100)/100;
        const netWeight=data.NetWeight;
        const pricePerUnitQty=Math.round(100*discountedPrice/netWeight)/100;
        const finalData={...data,
                            CAT_ID:getCatId(data.CAT_NAME),
                            Name:data.Name.toUpperCase(),
                            Discount:discount,
                            DiscountedPrice:discountedPrice,
                            Labels:data.Labels.join(", "),
                            PricePerUnitQuantity:pricePerUnitQty,
                        };

        console.log(finalData);
        const result=await useAddProductAPI(finalData);
        alert(`product inserted with product Id: ${result.productId}, in category: ${result.categoryName}`);
        
    }
    return(
        <div
            style={{
                display:"flex",
                justifyContent:"center",
                margin:"auto",
                marginTop:'10px',
                marginBottom:'10px',
                width:"90%"
            }}
        >
                <Grid
                    sx={{width:{xs:"100%",sm:'80%',md:'60%',lg:'60%',xl:'50%'}}}
                    style={{background:"white"}}
                >
                    <Form fieldsArray={fieldsArray} columns={2} title={title} submitHandler={submitHandler}/>
                </Grid>
            
            {/* Will be coming soon */}
        </div>
    )
}