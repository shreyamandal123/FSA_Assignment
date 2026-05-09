import React from "react";
import Header from "../Header";
import MUIDataTable from "mui-datatables";
import { IconButton, Grid, Snackbar, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Edit, Delete } from "@material-ui/icons";
import axios from "axios";
import { connect } from "react-redux";
import EditShop from "./EditShop";

class Shops extends React.Component {
  state = {
    stores: [],
    tableData: [],
    editing: null,
    toast: { open: false, message: "" },
  };

  componentDidMount() {
    this.fetchStores();
  }

  fetchStores = () => {
    const adminId = this.props.auth.user.id;
    axios.get(`http://localhost:5000/api/stores/getStores/${adminId}`).then((res) => {
      const stores = res.data || [];
      const tableData = stores.map((s, idx) => [idx + 1, s.storeName, s.category, s.city, s.address, s._id]);
      this.setState({ stores, tableData });
    });
  };

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableRow: { root: { "&$selected": { backgroundColor: "#e6f0ff !important" } } },
        MUIDataTableSelectCell: { checked: { color: "dodgerblue !important" } },
      },
    });

  handleDelete = (storeId) => {
    axios.delete(`http://localhost:5000/api/stores/deleteStore/${storeId}`).then(() => {
      this.setState({ toast: { open: true, message: "Shop deleted" } });
      this.fetchStores();
    });
  };

  render() {
    if (this.state.editing) {
      return (
        <EditShop
          shop={this.state.editing}
          onDone={() => {
            this.setState({ editing: null, toast: { open: true, message: "Shop updated" } });
            this.fetchStores();
          }}
          onCancel={() => this.setState({ editing: null })}
        />
      );
    }

    const columns = [
      { name: "id", label: "#" },
      { name: "storeName", label: "Shop Name" },
      { name: "category", label: "Category" },
      { name: "city", label: "City" },
      { name: "address", label: "Address" },
      {
        name: "edit",
        label: "Edit",
        options: {
          customBodyRenderLite: (dataIndex) => (
            <IconButton onClick={() => this.setState({ editing: this.state.stores[dataIndex] })}>
              <Edit style={{ color: blue[500] }} />
            </IconButton>
          ),
        },
      },
      {
        name: "delete",
        label: "Delete",
        options: {
          customBodyRenderLite: (dataIndex) => (
            <IconButton onClick={() => this.handleDelete(this.state.stores[dataIndex]._id)}>
              <Delete color="secondary" />
            </IconButton>
          ),
        },
      },
    ];

    return (
      <div>
        <Header />
        <Grid container justify="center" style={{ marginTop: "2rem" }}>
          <Typography variant="overline" style={{ fontSize: "1.5rem" }}>
            Manage Shops
          </Typography>
        </Grid>
        <Grid container justify="center" style={{ marginTop: "1rem" }}>
          <Grid item xs={10}>
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={"Shops"} data={this.state.tableData} columns={columns} options={{ selectableRows: "none" }} />
            </MuiThemeProvider>
          </Grid>
        </Grid>
        <Snackbar
          open={this.state.toast.open}
          autoHideDuration={2500}
          onClose={() => this.setState({ toast: { open: false, message: "" } })}
          message={this.state.toast.message}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps)(Shops);
