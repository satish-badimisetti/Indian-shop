import React, { useRef, useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Container
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import GroceryItemCardRenderer from "../Grocery-Item-Card/Grocery-Item-Card-Renderer";
import BrandCardRenderer from "./Brand-Card-Renderer";
import {  useGetBrandsAPI } from "./../../api/productsAPI";

import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  mainTitle: {
    marginBottom: theme.spacing(8),
    paddingTop: theme.spacing(6)
  },
  cardContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    padding: theme.spacing(6), // Add spacing between arrows and cards
    transition: "transform 0.3s ease-in-out", // Add transition for moving cards
  },
  arrowsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  arrowButton: {
    backgroundColor: "#FF6600",
    color: 'white',
    height: 50,
    width: 50,
    margin: 'auto',
    "&:disabled": {
      color: 'white',
      backgroundColor: '#D98E66',
    },
  },
  leftArrow: {
    marginRight: theme.spacing(4), // Add spacing at the end of the screen for left arrow
  },
//   rightArrow: {
//     marginLeft: theme.spacing(4), // Add spacing at the end of the screen for right arrow
//   },
}));


const ShopByBrandRenderer: React.FC = () => {
  const classes = useStyles();
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Placeholder for card content
  
  const [brands, setBrands] = useState<any[]>([]);

  //relating display of brands
  const [currentIndex, setCurrentIndex] = useState(0);
  const [noOfBrandsToShow, setNoOfBrandsToShow]=useState(4);
  const divRef = useRef<HTMLDivElement>(null);
  const [brandWidth,setBrandWidth]=useState(200);

  const updateBrandsToShow = () => {
    if (divRef.current) {
      const availableWidth = divRef.current.offsetWidth - 100;
      const newBrandsToShow = Math.floor(availableWidth / brandWidth);
      console.log(newBrandsToShow);
      setNoOfBrandsToShow(Math.max(newBrandsToShow, 1)); // Ensure at least 1 card is shown
    }
  };
  useEffect(() => {
    window.addEventListener("resize", updateBrandsToShow);
    updateBrandsToShow();
  }, []);
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - noOfBrandsToShow));
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + noOfBrandsToShow >= brands.length ? prevIndex : prevIndex + noOfBrandsToShow));
  };
  //end

  useEffect(() => {
    fetchBrands();
  }, []);
  const fetchBrands = async () => {
    const response = await useGetBrandsAPI();
    setBrands(response);
  };

  return (
    <div style={{ padding: "100px" }}>
      {/* <Container> */}
        <div className={classes.root}>
          <Typography variant="h4" className={classes.mainTitle}>
            Shop By Brands
          </Typography>
          <div className={classes.cardContainer}>
            <IconButton
              className={`${classes.arrowButton} ${classes.leftArrow}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <Grid
              container
              spacing={2}
              className={classes.gridContainer}
              ref={divRef}
              justifyContent={brands.length>(currentIndex + noOfBrandsToShow) ? "space-around" : "flex-start"}
              // sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}
            >
              {brands
                .slice(currentIndex, currentIndex + noOfBrandsToShow)
                .map((card, index) => (
                  <Grid key={index} item style={{width:`${brandWidth}`}}>
                    <BrandCardRenderer data={card} />
                  </Grid>
                ))}
            </Grid>
            <IconButton
              className={`${classes.arrowButton}`}
              onClick={handleNext}
              disabled={currentIndex >= brands.length - noOfBrandsToShow}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      {/* </Container> */}
    </div>
  );
};

export default ShopByBrandRenderer;
