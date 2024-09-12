const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51PfBwmRuvPwPFYBDPVkbDKIUMuqtw8XYJ8mGsrcErRBl4nj8HH8DIGdfqIgJj8TdYQsx8hL8QN1Z2c3ROXn7rho000s5o0GZta"
);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    Message: "success",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    console.log("Payment received");

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      res.status(202).json({
        client_secret: paymentIntent.client_secret,
      });
      console.log(paymentIntent);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        Message: "An error occurred while creating the payment intent",
      });
    }
  } else {
    res.status(401).json({
      Message: "Total value must be greater than zero",
    });
  }
});

const port = 5000;
app.listen(port, (error) => {
  if (error) {
    console.error(error);
    process.exit(1); // Terminate the process if there's an error starting the server
  } else {
    console.log(
      `The server is running successfully at http://localhost:${port}`
    );
  }
});
