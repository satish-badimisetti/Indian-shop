import React from "react"
import Form from "../../formComponent/Form"
export default function AddProduct(){
    const title="Add Product";
    const fieldsArray=[
        {fieldName:"Name", fieldLabel:"Product Name", fieldType:"text", validationSchema:{notEmpty:true,required:true}},
        {fieldName:"Cat_Name", fieldLabel:"Category Name", fieldType:"select", options:[{option:"Snacks",value:"Snacks"},{option:"Milk",value:"Milk"}], validationSchema:{notEmpty:true,required:true}},
        {fieldName:"Brand", fieldLabel:"Brand Name", fieldType:"select", options:[{option:"Maggi",value:"Maggi"},{option:"Heritage",value:"Heritage"}], validationSchema:{notEmpty:true,required:true}},
        {fieldName:"NoofUnits", fieldLabel:"No. of Units", fieldType:"text", validationSchema:{notEmpty:true,required:true, pattern:{value:/[0-9]+/,errorMessage:"Expect only Integers"}}},
        {fieldName:"Units", fieldLabel:"Units", fieldType:"select", options:[{option:"kg",value:"kg"},{option:"l",value:"l"},{option:"Nos",value:"Nos"}], validationSchema:{notEmpty:true,required:true}},
        {fieldName:"NetWeight", fieldLabel:"Net Weight", fieldType:"text", validationSchema:{notEmpty:true,required:true}},
        {fieldName:"Quantity", fieldLabel:"Quantity", fieldType:"text", validationSchema:{notEmpty:true,required:true}},
        {fieldName:"Price", fieldLabel:"Price", fieldType:"text", validationSchema:{notEmpty:true,required:true}},
        {fieldName:"Discount", fieldLabel:"Discount", fieldType:"text", validationSchema:{notEmpty:true,required:true}},
        {fieldName:"NoOfQuantitiesOnDiscountedPrice", fieldLabel:"Qt. for Discount", fieldType:"text", validationSchema:{notEmpty:true,required:true}},
        {fieldName:"Labels", fieldLabel:"Labels", fieldType:"selectItems", options:[{option:"Best Sellers",value:"Best Sellers"},{option:"New Arrivals",value:"New Arrivals"},{option:"On Sale",value:"On Sale"}], validationSchema:{notEmpty:{value:true,errorMessage:"required"}}},
        
        // {field:"Product_Visibility",title:"Visibility",type:"switch",toolbar:["select"],selectOptions:["yes","no"]}
    ]
    const submitHandler=(data:any)=>{
        console.log(data);
    }
    return(
        <>
            {/* <Form fieldsArray={fieldsArray} columns={2} title={title} submitHandler={submitHandler}/> */}
            Will be coming soon
        </>
    )
}