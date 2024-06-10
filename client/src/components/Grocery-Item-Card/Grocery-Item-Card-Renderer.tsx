import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  TextField,
} from "@material-ui/core";
import { useStyles } from "./Grocerty-Item-Card.styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { isClassExpression } from "typescript";
import apiConfig from "../../api/client/endpoint";

const BASE_URL = apiConfig.BASE_URL;

const GroceryItemCardRenderer = (product: any) => {
  const item: any = {};

  if (product.product) {
    (item.discount = Math.round(product.product.Discount * 100) / 100),
      (item.title = product.product.Name),
      (item.pricePerVolume =
        Math.round(product.product.PricePerUnitQuantity * 100) / 100),
      (item.currentPrice =
        Math.round(product.product.DiscountedPrice * 100) / 100),
      (item.originalPrice = Math.round(product.product.Price * 100) / 100),
      (item.image = product.product.PROD_IMG);
  }

  const classes: any = useStyles();
  return (
    <>
      {product.product && (
        <Card className={classes.cardStyles}>
          <div className={classes.container1}></div>
          <div className={classes.container2}>
            <div className={classes.overlay}></div>
            <div className={classes.imageContainer}>
              <div className={classes.image}>
                {/* src={`data:image/png;base64,${item.image}`} */}
                <img
                  src={`${BASE_URL}images/PRODUCTS/${item.image}`}
                  alt="Product"
                  className={classes.image}
                />
              </div>
            </div>
          </div>
          <div className={classes.discountContainer}>
            <div className={classes.discountText}>{item.discount}% OFF</div>
          </div>
          <CardContent className={classes.title}>{item.title}</CardContent>
          <CardContent className={classes.price}>
          €&nbsp;{item.pricePerVolume}
          </CardContent>
          <CardContent className={classes.priceContainer}>
            <Typography className={classes.priceValue}>
              €&nbsp;{item.currentPrice}
              {item.originalPrice && <span>€&nbsp;{item.originalPrice}</span>}
            </Typography>
          </CardContent>
          {/* <CardActions className={classes.actionButtonsContainer}>
            <IconButton className={classes.cardItemIcons}>
              <RemoveIcon />
            </IconButton>
            <TextField
              className={classes.cardItemTextField}
              variant="outlined"
              size="small"
            />
            <IconButton className={classes.cardItemIcons}>
              <AddIcon />
            </IconButton>
            <div className={classes.addButton}>
              <div className={classes.addText}>Add</div>
            </div>
          </CardActions> */}
        </Card>
      )}
    </>
  );
};

export default GroceryItemCardRenderer;
