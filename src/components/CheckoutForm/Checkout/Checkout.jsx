import React, { Fragment, useState, useEffect } from "react";
import { Paper, Stepper, Step, StepLabel, Typography } from "@material-ui/core";
import { commerce } from "../../../lib/commerce";

import AddressForm from "./../AddressForm";
import PaymentForm from "./../PaymentForm";
import useStyles from "./styles";
const steps = ["Shipping address", "Payment details"];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState();

  const classes = useStyles();

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });
        setCheckoutToken(token);
      } catch (error) {}
    };
    generateToken();
  }, [cart]);

  const nextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const backStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const Confirmation = () => (
    <div style={{ padding: "20px" }}>Confirmation</div>
  );

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
      />
    );

  return (
    <Fragment>
      <div className={classes.toolbars} />
      <main className={classes.layout}>
        <Paper>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </Fragment>
  );
};

export default Checkout;
