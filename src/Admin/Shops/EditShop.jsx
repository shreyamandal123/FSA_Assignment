import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  CardContent,
  Button,
  Card,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Save, Cancel } from "@material-ui/icons";
import Header from "../Header";
import axios from "axios";

class EditShop extends React.Component {
  state = {
    shopName: this.props.shop.storeName || "",
    shopCategory: this.props.shop.category || "Grocery",
    shopAddress: this.props.shop.address || "",
    shopCity: this.props.shop.city || "",
  };

  handleClick = (e) => {
    e.preventDefault();
    const { shopName, shopCategory, shopAddress, shopCity } = this.state;
    axios
      .patch(`http://localhost:5000/api/stores/updateStore/${this.props.shop._id}`, {
        shopName,
        shopCategory,
        shopAddress,
        shopCity,
        cityData: this.props.shop.cityData,
        addressData: this.props.shop.addressData,
      })
      .then((res) => this.props.onDone(res.data));
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div>
        <Header />
        <Grid justify="center" container>
          <Card variant="outlined" style={{ margin: "2rem", width: "35rem" }}>
            <CardContent>
              <form>
                <Typography style={{ fontSize: "1rem" }} variant="overline" display="block">
                  Edit Shop
                </Typography>
                <hr />
                <br />
                <TextField
                  name="shopName"
                  variant="outlined"
                  required
                  fullWidth
                  label="Shop Name"
                  onChange={this.handleChange}
                  value={this.state.shopName}
                />
                <br />
                <br />
                <Select
                  name="shopCategory"
                  variant="outlined"
                  required
                  fullWidth
                  onChange={this.handleChange}
                  value={this.state.shopCategory}
                >
                  <MenuItem value={"Grocery"}>Grocery</MenuItem>
                  <MenuItem value={"Stationary and Novelties"}>Stationary and Novelties</MenuItem>
                  <MenuItem value={"Pharmacy"}>Pharmacy</MenuItem>
                  <MenuItem value={"Clothing and Accessories"}>Clothing and Accessories</MenuItem>
                  <MenuItem value={"Cosmetics"}>Cosmetics</MenuItem>
                </Select>
                <br />
                <br />
                <TextField
                  name="shopAddress"
                  variant="outlined"
                  required
                  fullWidth
                  label="Shop Address"
                  onChange={this.handleChange}
                  value={this.state.shopAddress}
                />
                <br />
                <br />
                <TextField
                  name="shopCity"
                  variant="outlined"
                  required
                  fullWidth
                  label="Shop City"
                  onChange={this.handleChange}
                  value={this.state.shopCity}
                />
                <br />
                <br />
                <Grid justify="center" spacing={3} container>
                  <Grid item>
                    <Button variant="outlined" size="large" style={{ color: blue[500] }} startIcon={<Save />} onClick={this.handleClick}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="secondary" variant="outlined" size="large" startIcon={<Cancel />} onClick={this.props.onCancel}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </div>
    );
  }
}

export default EditShop;
