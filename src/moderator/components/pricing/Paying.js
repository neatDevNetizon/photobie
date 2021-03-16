import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  IbanElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { API,graphqlOperation, Auth,Storage } from 'aws-amplify';
// import { injectStripe } from 'react-stripe-elements';

import { Grid, Button, Box, withTheme } from "@material-ui/core";
import StripeCardForm from "./stripe/StripeCardForm";
import StripeIbanForm from "./stripe/StripeIBANForm";
import FormDialog from "../../../shared/components/FormDialog";
import ColoredButton from "../../../shared/components/ColoredButton";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as subscriptions from '../../../graphql/subscriptions';
const stripePromise = loadStripe("pk_test_51IGE7tCpN6M21hIWvCGsDsRU3lw6JAsvlhff9JeYB8b3AKzQtOM0ZBGD40HqqnTb2mKqhXRtfW6xG4IEKmssJbLD00PhAx8aiP");

const paymentOptions = ["Credit Card", 
// "SEPA Direct Debit"
];

const AddBalanceDialog = withTheme(function (props) {
  const { open, theme, onClose, onSuccess, price, results,tokenNum } = props;

  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState("Credit Card");
  const [stripeError, setStripeError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(price);
  const [amountError, setAmountError] = useState("");
  const elements = useElements();
  const stripe = useStripe();
  const [userEmail, setUserEmail] = useState("")
  const [userToken, setUserToken] = useState("");
  const [userId, setUserId] = useState("");

  const onAmountChange = amount => {
    if (amount < 0) {
      return;
    }
    if (amountError) {
      setAmountError("");
    }
    setAmount(amount);
  };
  
  useEffect(()=>{
    async function fetchUser(){
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        setUserEmail(email);

        const userToken = await API.graphql(graphqlOperation(queries.listUserCs, { filter: {email:{eq:email}}}));
        setUserToken(userToken.data.listUserCs.items[0].token);
        setUserId(userToken.data.listUserCs.items[0].id)
      }
      return ;
    }
    fetchUser();
  },[])
  const getStripePaymentInfo = () => {
    switch (paymentOption) {
      case "Credit Card": {
        return {
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: { name: name, }
        };
      }
      case "SEPA Direct Debit": {
        return {
          type: "sepa_debit",
        //   amount:amount,
          sepa_debit: elements.getElement(IbanElement),
          billing_details: { email: email, name: name }
        };
      }
      default:
        throw new Error("No case selected in switch statement");
    }
  };

  const renderPaymentComponent = () => {
    switch (paymentOption) {
      case "Credit Card":
        return (
          <Fragment>
            <Box mb={2}>
              <StripeCardForm
                stripeError={stripeError}
                setStripeError={setStripeError}
                setName={setName}
                name={name}
                amount={amount}
                amountError={amountError}
                onAmountChange={onAmountChange}
              />
            </Box>
            <HighlightedInformation>
              You can check this integration using the credit card number{" "}
              <b>4242 4242 4242 4242 04 / 24 24 242 42424</b>
            </HighlightedInformation>
          </Fragment>
        );
      case "SEPA Direct Debit":
        return (
          <Fragment>
            <Box mb={2}>
              <StripeIbanForm
                stripeError={stripeError}
                setStripeError={setStripeError}
                setName={setName}
                setEmail={setEmail}
                name={name}
                email={email}
                amount={amount}
                disabled={true}
                amountError={amountError}
                onAmountChange={onAmountChange}
              />
            </Box>
            <HighlightedInformation>
              You can check this integration using the IBAN
              <br />
              <b>DE89370400440532013000</b>
            </HighlightedInformation>
          </Fragment>
        );
      default:
        throw new Error("No case selected in switch statement");
    }
  };
 
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline="Add Balance"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        if (amount <= 0) {
          setAmountError("Can't be zero");
          return;
        }
        if (stripeError) {
          setStripeError("");
        }
        setLoading(true);
        const { error, paymentMethod } = await stripe.createPaymentMethod(
          getStripePaymentInfo()
        );
        if (error) {
          setStripeError(error.message);
          setLoading(false);
          return;
        } else
            
        {   
            const body = {
                name: name,
                description: "description",
                images: ['http://lorempixel.com/400/200/'],
                amount: amount,
                currency: "usd",
                quantity: 100,
                success_url:'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url:'https://example.com/cancel'
            }
            const response = await API.post("restapi", "/paying", {body} )
            console.log(response)
            if(response.err==null){

              await API.graphql(graphqlOperation(mutations.updateUserC, {input:{id:userId, token : tokenNum+userToken}})).then((res)=>{
                // console.log(res)
                setLoading(false);
                onClose();
                results();
                // const subscription = API
                //   .graphql(graphqlOperation(subscriptions.onUpdateUserA))
                //   .subscribe({
                //     next: (event) => {
                //       console.log(event.value.data);
                //     }
                //   });

                // return () => {
                //   subscription.unsubscribe();
                // }
              });
              const transData = {
                userid:userId,
                detail: "Buying " + amount*100 + " tokens",
                amount: amount*100,
                date:new Date(),
                status:2
              }
              await API.graphql(graphqlOperation(mutations.createTransaction, {input: transData}))
                
            }
            else {
                setLoading(false);
                console.log("retry")
            }
        }
        
      }}
      content={
        <Box pb={2}>
          <Box mb={2}>
            <Grid container spacing={1}>
              {/* {paymentOptions.map(option => (
                <Grid item key={option}>
                  <ColoredButton
                    variant={
                      option === paymentOption ? "contained" : "outlined"
                    }
                    disableElevation
                    onClick={() => {
                      setStripeError("");
                      setPaymentOption(option);
                    }}
                    color={theme.palette.common.black}
                  >
                    {option}
                  </ColoredButton>
                </Grid>
              ))} */}
            </Grid>
          </Box>
          {renderPaymentComponent()}
        </Box>
      }
      actions={
        <Fragment>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            size="large"
            disabled={loading}
          >
            Pay with Stripe {loading && <ButtonCircularProgress />}
          </Button>
        </Fragment>
      }
    />
  );
});

AddBalanceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  results: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
  tokenNum: PropTypes.number.isRequired,
};

function Wrapper(props) {
  const { open, onClose, onSuccess, price, results, tokenNum } = props;
  return (
    <Elements stripe={stripePromise}>
      {open && (
        <AddBalanceDialog open={open} onClose={onClose} onSuccess={onSuccess} tokenNum = {tokenNum} results = {results} price = {price}/>
      )}
    </Elements>
  );
}


AddBalanceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
  results: PropTypes.func.isRequired,
  tokenNum: PropTypes.number.isRequired,
};

export default Wrapper;
