import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import axios from "axios";

function MyOrders({ auth }) {
  const [expanded, setExpanded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "" });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const userId = auth && auth.user ? auth.user.id : null;
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        const msg =
          (err.response && err.response.data && err.response.data.error) ||
          "Failed to load orders";
        setToast({ open: true, message: msg });
      });
  }, [auth]);

  if (orders.length === 0) {
    return (
      <Grid container justify="center" style={{ marginTop: "2rem" }}>
        <Typography variant="h6" color="textSecondary">
          You haven't placed any orders yet.
        </Typography>
      </Grid>
    );
  }

  return (
    <>
      {orders.map((order) => {
        const { _id, items = [], total, status, createdAt } = order;
        return (
          <Grid container justify="center" key={_id}>
            <Grid item xs={8}>
              <Accordion
                expanded={expanded === _id}
                onChange={handleChange(_id)}
                style={{ margin: "0.5rem" }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Grid container justify="space-between">
                    <Typography>Order #{_id.slice(-6)}</Typography>
                    <Typography>{new Date(createdAt).toLocaleString()}</Typography>
                    <Typography>Status: {status}</Typography>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {items.map((item, idx) => (
                              <TableRow key={`${_id}_${idx}`}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.price}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">Total: $ {total}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        );
      })}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, message: "" })}
        message={toast.message}
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MyOrders);
