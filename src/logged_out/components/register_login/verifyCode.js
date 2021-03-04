import React, { useState,useRef, Fragment } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  withStyles,
} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import { Auth } from 'aws-amplify';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
});

function RegisterDialog(props) {
  const { setStatus, theme, onClose, openTermsDialog, status, username } = props;
  const [isLoading, setIsLoading] = useState(false);
  const loginEmail = useRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  async function verifying() {
    const code = loginEmail.current.value;
    try {
        await Auth.confirmSignUp(username, code);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onClose();
         }, 1500); 
         enqueueSnackbar('Confirm success', {
          variant: 'success',
          action: key => (
              <CloseIcon onClick={() => closeSnackbar(key)}/>
          )
        });  
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }
  return (
    <div>

      <div>
      <FormDialog
      loading={isLoading}
      open
      headline="Confirm Verify"
      onFormSubmit={(e) => {
        e.preventDefault();
        verifying();
      }}
      onClose={onClose}
    //   hasCloseIcon
      content={
        <Fragment>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={status === "invalidEmail"}
            label="Verify Code"
            autoFocus
            autoComplete="off"
            type="number"
            inputRef={loginEmail}
            onChange={() => {
              if (status === "invalidEmail") {
                setStatus(null);
              }
            }}
            FormHelperTextProps={{ error: true }}
          />
        
        </Fragment>
      }
      actions={
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="secondary"
          disabled={isLoading}
        >
          Confirm
          {isLoading && <ButtonCircularProgress />}
        </Button>
      }
    />
      </div>
    </div>
    
  );
}

RegisterDialog.propTypes = {
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openTermsDialog: PropTypes.func.isRequired,
  status: PropTypes.string,
  setStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RegisterDialog);
