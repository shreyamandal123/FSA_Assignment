import React from "react";
import Header from "../Header";
import MyOrders from "./MyOrders";
import { Typography, Grid } from "@material-ui/core";

class Orders extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Grid container justify="center">
          <Typography variant="overline" style={{ fontSize: "1.5rem" }}>
            My Orders
          </Typography>
        </Grid>
        <MyOrders />
      </div>
    );
  }
}

export default Orders;
