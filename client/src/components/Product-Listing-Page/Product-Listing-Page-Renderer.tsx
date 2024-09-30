import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputBase,
  Select,
  MenuItem,
} from "@material-ui/core";
import SortIcon from "@material-ui/icons/Sort";
import GroceryItemCardRenderer from "../Grocery-Item-Card/Grocery-Item-Card-Renderer";
import SearchIcon from "@mui/icons-material/Search";
//apis
import {
          useGetProductsByCategoryIDAPI,
          useGetProductsByFilterAPI,
          useGetProductsByLabel,
          useSearchProducts
        } from "../../api/productsAPI";
import ProductsBannerRenderer from "../Components-Banner/Products-Banner-Renderer";

const ProductListingPageRenderer: React.FC = () => {
  const classes = useStyles();
  const [products,setProducts]=useState<any[]>([]);
  const [productsToShow,setProductsToShow]=useState<any[]>([]);
  const [searchString,setSearchString]=useState("");
  const [sortOption,setSortOption]=useState(0);
  // const [listingType,setListingType]=useState<string | undefined>("");
  // const [categoryId,setCategoryId]=useState<string | undefined>("");
  // const [brandName,setBrandName]=useState<string | undefined>("");
  const {type,target}=useParams();
  const categoryid=17;
  useEffect(()=>{
    console.log(type);
    console.log(target);
    updateProducts();
  },[type,target]);
  

  const updateProducts=async ()=>{
    let productsList:any[]=[];
    if(type=="category"){
      productsList=await useGetProductsByCategoryIDAPI(target);
    }
    if(type=="brand"){
      productsList=await useGetProductsByFilterAPI({Brand:target});
    }
    if(type=="label"){
      if(target) productsList=await useGetProductsByLabel(target);
      else productsList=[];
    }
    if(type=="search"){
      if(target) productsList=await useSearchProducts(target);
      else productsList=[];
    }
    
    setProducts(productsList);
    updateProductsToShow(productsList,searchString,sortOption===1?1:-1);
  }
  const handleSearchTextUpdate=(e:any)=>{
    const searchText=e.target.value;
    updateProductsToShow(products,searchText,sortOption===1?1:-1);
    setSearchString(e.target.value);
  }
  const updateProductsToShow=(products:any[],searchText:string,sortOrder:number=0)=>{
    setProductsToShow(
      products.filter((product)=>{
        return (`${product.Brand}-${product.Name}`).toUpperCase().includes(searchText.toLocaleUpperCase());
      }).sort((a,b)=>(a.DiscountedPrice - b.DiscountedPrice)*sortOrder)
    )
  }

  const handleSortOptionChange=(e:any)=>{
    const optionvalue=e.target.value;
    setSortOption(optionvalue);
    updateProductsToShow(productsToShow,searchString,optionvalue===1?1:-1)
  }
  const [showGoToTop,setShowGoToTop]=useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowGoToTop(true);
      } else {
        setShowGoToTop(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
    <ProductsBannerRenderer />
    <Container maxWidth="lg" className={classes.container}>
      <div className={classes.header}>
        <div className={classes.available} >
          <Typography className={classes.title}>
            {type=="category" && products[0]?.CAT_NAME}
            {type=="brand" && products[0]?.Brand}
          </Typography>
          <Typography variant="body2">
            <span >{productsToShow.length} available</span>
          </Typography>
        </div>
        <div className={classes.controls}>
          <div className={classes.searchContainer}>
            <InputBase
              placeholder="What are your looking for"
              className={classes.searchInput}
              value={searchString}
              onChange={(e)=>handleSearchTextUpdate(e)}
            />
            <div className={classes.searchIcon}>
              <SearchIcon style={{ width: 18, height: 18 }} />
            </div>
          </div>
          <FormControl variant="outlined" >
            <Select
              labelId="sort-by-label"
              value={sortOption}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ "aria-label": "Sort By" }}
              onChange={(e)=>{handleSortOptionChange(e)}}
            >
                <MenuItem value={0} disabled>Sort By</MenuItem>
                <MenuItem value={1}>Price: Low to High</MenuItem>
                <MenuItem value={2}>Price: High to Low</MenuItem>
                {/* <MenuItem value={3}>Best Seller</MenuItem> */}
            </Select>
          </FormControl>
        </div>
      </div>
      <Divider className={classes.divider} />
      <Grid container spacing={3}>
        {productsToShow.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <GroceryItemCardRenderer product={product}/>
            </Grid>
          
        ))}
      </Grid>
    </Container>
    {
      showGoToTop && (
        <div className={classes.scrollToTop}>
          <button className={classes.goToTopButton}
            onClick={scrollToTop}
          >
            &#8679; Go to Top
          </button>
        </div>
      )
    }
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(20)
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      width: 737,
      color: '#0D3823',
      fontSize: 24,
      fontFamily: 'Proxima Nova',
      fontWeight: 800,
      wordWrap: 'break-word',
      marginBottom: theme.spacing(1)
    },
    controls: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto"
    },
    searchBox: {
      height: 35,
      marginRight: theme.spacing(1),
    },
    searchContainer: {
      position: 'relative',
      backgroundColor: '#FFF',
      borderRadius: 6,
      width: 252,
      height: 35,
      marginRight: theme.spacing(2),
      border: "1px solid grey"
    },
    searchInput: {
      marginLeft: theme.spacing(2),
      flex: 1,
      color: '#909592',
      fontFamily: 'Proxima Nova',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '24px',
      '&::placeholder': {
        color: '#909592'
      }
    },
    searchIcon: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#909592',
      width: 14.35,
      height: 14.35,
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)'
    },
    selectEmpty: {
      height: 35, // Adjust the height as needed
      minWidth: 120, // Add any additional styling here
    },
    divider: {
      height: "2px",
      width: "100%",
      backgroundColor: theme.palette.primary.main,
      marginBottom: theme.spacing(2),
    },
    available: {
      display: 'block', // Ensure the text appears on a separate line
    },
    scrollToTop: {
      position: "fixed",
      bottom: "40px",
      right: "40px",
      zIndex: 1000,
    },
    goToTopButton:{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "opacity 0.3s ease"
    }
  })
);

export default ProductListingPageRenderer;
