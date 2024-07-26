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

async function addProduct(productObject){
  // const base64Data = productObject.image.replace(/^data:image\/\w+;base64,/, '');
  const base64Data = productObject.uploadFile.base64String.replace('data:', '').replace(/^.+,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  //filename
  // const filename = `${productObject.Name}.png`;
  const filename = productObject.uploadFile.fileName;
  const filePath = path.join(__dirname, '../images/products', filename);
  let result=true
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      result=false
    }
  });
  return result
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
  const productObjectId=new ObjectId(productDocumentId)
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const collection=db.collection("Products");
    
    const result=await collection.deleteOne( { _id: productObjectId });
    return result.deletedCount;

  }catch(err){
    throw err;
  }
}
async function getOptionsForAddProduct(){
  const client=await createDocDBConnection();
  try{
    const db=client.db(dbName);
    const collection=db.collection("Products");
    
    const result=await collection.aggregate( [{$group:{ _id: "$Brand" }}]);
    result.forEach(doc => console.log(doc));

  }catch(err){
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
    console.log(products);
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
  deleteProduct
};
