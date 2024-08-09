const { MongoClient, ObjectId } = require("mongodb");
const fs = require('fs');
const path = require("path");
const config = require("../config");
const { warn } = require("console");


const caFilePath = path.join(__dirname, "..", "global-bundle.pem");

var docDbInstance;
const dbName = config.getMongoDbName();

/**
 * Create AWS Document DB connection
 */
async function createDocDBConnection() {
  if (docDbInstance) return docDbInstance;

  // var client = MongoClient.connect(config.getMongoDbUrl(), {
  //   tlsCAFile: [caFilePath],
  // });
  var client = MongoClient.connect(config.getMongoDbUrl());

  docDbInstance = client;
  return client;
}

/**
 *
 * @returns Load all the Products
 */
async function getAllProducts() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("Products");

    const products = await col.find({}).toArray();
    // console.log("all products " + JSON.stringify(products))
    return products;
  } catch (err) {
    console.error("Error fetching products: ", err);
    throw err;
  }
}
/**
 *
 * @returns Load all the Products Categories
 */
async function getProductCategories() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("Categories");

    const products = await col.find({}).toArray();
    // console.log("all Categories " + JSON.stringify(products))
    return products;
  } catch (err) {
    console.error("Error fetching Categories: ", err);
    throw err;
  }
}
async function getAllBrands(){
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const collection=db.collection("allBrands");
    
    const result=await collection.find({}).toArray();
    const brands=result[0].brands;
    return brands;  
  }catch(err){
    console.log(err)
    throw err;
  }
}
async function checkAndUpdateBrands(collection, brandName){
  // const client=await createDocDBConnection();
  try{
    // const db=client.db(dbName);
    // const collection=db.collection("allBrands");
    const result=await collection.find({}).toArray();
    const brands=result[0].brands;
    if(brands.indexOf(brandName)==-1){
      try{
        const result=await collection.updateOne({_id:result[0]._id},{brands:[...brands,brandName]});
        console.log("brands updated: ");
        return true;
      }catch(err){
        console.log("unable to modify brands",err);
        return false;
      }
    }
    else{
      console.log("old Brand");
    }
  }catch(err){
    console.log("unable to connect to DB",err);
    return false;
  }
}
async function checkAndUpdateLabels(collection, labelString){
  const labelsArray=labelString.split(", ");
  try{
    // const db=client.db(dbName);
    // const collection=db.collection("labels");
    const result=await collection.find({}).toArray();
    const labels=result[0].labels;
    let newLabels=[];
    labelsArray.forEach(labelName=>{
      if(labels.indexOf(labelName)==-1) newLabels.push(labelName);
    });
    if(newLabels.length>0){
      try{
        const result=await collection.updateOne({_id:result[0]._id},{labels:[...labels,...newLabels]});
        console.log("new label added: ", newLabels);
        return true;
      }catch(err){
        console.log("unable to modify labels",err);
        return false;
      }
    }
  }catch(err){
    console.log("unable to connect to DB-labels update",err);
    return false;
  }
}
async function getAllLabels(){
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const collection=db.collection("labels");
    
    const result=await collection.find({}).toArray();
    const labels=result[0].labels;
    return labels;  
  }catch(err){
    console.log(err)
    throw err;
  }
}
//adds category provided categoryName & collection instance -> returns new category id
async function addCategory(collection,categoryName){
  try{
    const result=await collection.aggregate([{$group:{_id:null,lastCategoryId:{$max:'$CAT_ID'}}}]).toArray();
    const nextCatId=result[0].lastCategoryId + 1;
    const result1=await collection.insertOne({CAT_NAME:categoryName,CAT_ID:nextCatId});
    if(result1.acknowledged) return nextCatId;
    else return -1;
  }catch(err){
    console.log("unable to perform DB operations - add category ",err);
    return -1;
  }
}
async function saveFile(targetPath,base64Data){
  const buffer = Buffer.from(base64Data, 'base64');
  try {
    fs.writeFileSync(targetPath, buffer);
    return true
  } catch (err) {
    console.log("unable to add file ",err);
    return false;
  }
}
async function addProduct(productObject){
  const client=await createDocDBConnection();
  const db=client.db(dbName);
  const productsCollection=db.collection("Products");
  //new CatId? action
  let catId=productObject.CAT_ID;
  let productId=0;
  if(catId==""){
    catId=await addCategory(db.collection("Categories"),productObject.CAT_NAME);
    if(catId==-1){
      console.log("new category insertaion failed");
      return {status:"fail",message:"unable to add new category. exited without saving image & inserting product"};
    }
    productId=1;
    console.log("new category id: ",catId);
  }else{
    catId=parseInt(catId,10);
    console.log("existing category id: ",catId);
    try{
      const result=await productsCollection.aggregate([{$match:{CAT_ID:catId}},{$group:{_id:null,lastProdId:{$max:"$PROD_ID"}}}]).toArray();
      productId=result[0].lastProdId + 1;
    }catch(err){
      console.log("error while getting maximum product id in give category");
      return {status:"fail",message:"unable to get maximum product id for the given category"};
    }
    console.log("productId: ",productId);
  }
  //check brand
  const result=await checkAndUpdateBrands(db.collection("allBrands"),productObject.Brand);
  //check labels
  const result1=await checkAndUpdateLabels(db.collection("labels"),productObject.Labels);

  const base64Data = productObject.productImage.replace('data:', '').replace(/^.+,/, '');
  const fileName=String(catId).padStart(2,"0")+String(productId).padStart(5,"0")+".png";
  const targetPath=path.join(__dirname,"../images/PRODUCTS/",fileName);
  const saveFileResult=saveFile(targetPath,base64Data);
  if(saveFileResult){
    const modifiedProductObject={...productObject,
                      CAT_ID:catId,
                      PROD_ID:productId,
                      NoofUnits:parseInt(productObject.NoofUnits),
                      UnitWeight:parseFloat(productObject.UnitWeight),
                      NetWeight:parseFloat(productObject.NetWeight),
                      Quantity:parseInt(productObject.Quantity),
                      Price:parseFloat(productObject.Price),
                      Discount:parseFloat(productObject.Discount),
                      DiscountedPrice:parseFloat(productObject.DiscountedPrice),
                      PricePerUnitQuantity:parseFloat(productObject.PricePerUnitQuantity),
                      NoOfQuantitiesOnDiscountedPrice:parseFloat(productObject.NoOfQuantitiesOnDiscountedPrice),
                      PROD_IMG:fileName
                    };
    delete modifiedProductObject.productImage;
    const result=await productsCollection.insertOne(modifiedProductObject);
    if(result.acknowledged){
      return {status:"success",productId:productId,categoryName:catId};
    }
    else{
      return {status:"fail",message:"insert product failed. not acknowledged"};
    }
    
  }else{
    console.log("unable to save product image");
    return {status:"fail",message:"unable to save product image"};
  }
  
}
//update Product: productObject=> object of filed:value ->to be modified, should not contain _id; returns modifiedCount
async function updateProduct(productDocumentId,productObject){
  const productObjectId=new ObjectId(productDocumentId);
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const collection=db.collection("Products");
    
    const result=await collection.updateOne( { _id: productObjectId }, { $set: productObject } );
    return result.modifiedCount;

  }catch(err){
    console.log(err)
    throw err;
  }
}
async function deleteProduct(productDocumentId){
  const productObjectId=new ObjectId(productDocumentId);
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const collection=db.collection("Products");
    const result=await collection.find({_id:productObjectId},{CAT_ID:1,PROD_ID:1}).toArray();

    //product image
    const fileName=String(result[0].CAT_ID).padStart(2,"0")+String(result[0].PROD_ID).padStart(5,"0")+".png";
    const targetPath=path.join(__dirname,"../images/PRODUCTS/",fileName);
    const result1=await collection.deleteOne( { _id: productObjectId });
    if(result1.deletedCount){
      try{
        fs.unlinkSync(targetPath);
        return result1.deletedCount;
      }catch(err){
        console.log("file deletion error",err);
        throw err;
      }
    }else{
      return "document not deleted"
    }
  }catch(err){
    console.log("DB Error", err);
    throw err;
  }
}
// getOptionsForAddProduct();
//One time requirement for updaing the productvisibility of the products
async function updateProductVisibility(){
  const client=await createDocDBConnection();
  const db=client.db(dbName);
  const collection=db.collection("Products");

  const products=await getAllProducts();
  
  products.forEach(async (target) => {
        const result1=await collection.updateOne( { PROD_ID: target.PROD_ID,CAT_ID:target.CAT_ID }, { $set: { "ProductVisibility":"Yes" } } ) 
  });
}
// updateProductVisibility();
//One time requirement for updaing the cateogry name of the products
async function updateCategoryNames(){
  const client=await createDocDBConnection();
  const db=client.db(dbName);
  const collection=db.collection("Products");

  const categoriesArray=await getProductCategories();
  const products=await getAllProducts();

  products.forEach(target => {
    categoriesArray.some((category)=>{
      if(category.CAT_ID==target.CAT_ID){
        // console.log({...target,["CAT_NAME"]:category.CAT_NAME});
        collection.updateOne( { PROD_ID: target.PROD_ID,CAT_ID:target.CAT_ID }, { $set: { "CAT_NAME":category.CAT_NAME } } ) 
        return true;
      }
    })
  });
  
  // console.log(products[0]);

}
async function updateAllProducts(){
  const client=await createDocDBConnection();
  const db=client.db(dbName);
  const collection=db.collection("Products");

  const products=await getAllProducts();

  products.forEach(target => {
        const Price=parseFloat(target.Price);
        const DiscountedPrice=parseFloat(target.DiscountedPrice);
        const newDiscount=Math.round(((Price-DiscountedPrice)/Price)*100)/100;
        // console.log(`${target.PROD_ID},${target.CAT_ID}-${newDiscount}`);
        

        collection.updateOne( { PROD_ID: target.PROD_ID,CAT_ID:target.CAT_ID }, { $set: { "Discount":newDiscount } } ) 
        
        return true;
  });
  console.log("Done")

}
// updateAllProducts();

/**
 *
 * @returns Load all the Products by category by Id
 */
async function getProductsByCategoryId(categoryId) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("Products");

    const products = await col.find({ CAT_ID: parseInt(categoryId) }).toArray();
    return products;
  } catch (err) {
    console.error("Error fetching getProductsByCategoryId: ", err);
    throw err;
  }
}
// getProductsByCategoryId(1)
/**
 *
 * @returns Load all the Products by bestsellets
 */
async function getProductsByFilter(filter) {
  const client = await createDocDBConnection();
  try {
    const db = client.db(dbName);
    const col = db.collection("Products");

    const products = await col.find(filter).toArray();
    return products;
  } catch (err) {
    console.error("Error fetching getProductsByFilter: ", err);
    throw err;
  }
}
async function getBestSellers() {
  const client = await createDocDBConnection();
  try {
    const db = client.db(dbName);
    const col = db.collection("Products");
    const products = await col.find({Labels:{ $regex: "Bestsellers", $options: "i" }}).toArray();
    return {status:"success",products:products}
  } catch (err) {
    console.error("Error fetching getProductsByFilter: ", err);
    return {status:"fail",message:"unable to connect DB"}
  }
}
async function getProductsByLabel(labelName) {
  const client = await createDocDBConnection();
  try {
    const db = client.db(dbName);
    const col = db.collection("Products");
    const products = await col.find({Labels:{ $regex: labelName, $options: "i" }}).toArray();
    return {status:"success",products:products}
  } catch (err) {
    console.error("Error fetching getProductsByFilter: ", err);
    return {status:"fail",message:"unable to connect DB"}
  }
}
async function getProductsBySearchString(searchString){
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const col=db.collection("Products");
    const products=await col.find({$expr:{
                              $regexMatch:{
                                input:{$concat:["$Brand","$Name"]},
                                regex:searchString,
                                options:"i"
                              }
                            }
                          }).toArray();                          
    return {status:"success",products:products};
  }catch(err){
    console.log("unable to get products by search string ",err);
    return {status:"fail",message:"unable to connect DB"}
  }
}
async function getBrands() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("Brands");

    const products = await col.find({}).toArray();
    
    return products;
  } catch (err) {
    console.error("Error fetching Brands: ", err);
    throw err;
  }
}

module.exports = {
  getAllProducts,
  getProductCategories,
  getProductsByCategoryId,
  getProductsByFilter,
  getBrands,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllBrands,
  getBestSellers,
  getProductsByLabel,
  getProductsBySearchString
};
