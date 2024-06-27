const { MongoClient, ObjectId } = require("mongodb");
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
    console.log("all products " + JSON.stringify(products))
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
    console.log("all Categories " + JSON.stringify(products))
    return products;
  } catch (err) {
    console.error("Error fetching Categories: ", err);
    throw err;
  }
}

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
    console.log("all getProductsByCategoryId " + JSON.stringify(products))
    return products;
  } catch (err) {
    console.error("Error fetching getProductsByCategoryId: ", err);
    throw err;
  }
}

/**
 *
 * @returns Load all the Products by bestsellets
 */
async function getProductsByFilter(filter) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("Products");

    const products = await col.find({ Labels: filter}).toArray();
    console.log("all getProductsByFilter " + JSON.stringify(products))
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
    console.log("all Brands " + JSON.stringify(products))
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
  getBrands
};
