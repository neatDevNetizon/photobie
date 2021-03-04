import React from 'react';
import PropTypes from 'prop-types';
// import { Icon } from '@iconify/react';
import { SnackbarProvider } from 'notistack';
// import infoFill from '@iconify-icons/eva/info-fill';
// import alertCircleFill from '@iconify-icons/eva/alert-circle-fill';
// import alertTriangleFill from '@iconify-icons/eva/alert-triangle-fill';
// import checkmarkCircle2Fill from '@iconify-icons/eva/checkmark-circle-2-fill';
import { makeStyles } from '@material-ui/core/styles';

// ----------------------------------------------------------------------
const PRIMARY = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249'
};
const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A'
};
const info = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A'
};
const success= {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D'
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01'
};
const error = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E'
};
const useStyles = makeStyles(theme => {
  const isLight = theme.palette.mode === 'light';

  const createStyle = color => {
    console.log(color)
    return {
      color: `#FFA48D !important`,
      backgroundColor: `${theme.palette.grey[isLight ? 0 : 800]} !important`,
      '& $icon': {
        color: theme.palette[color].main,
        // backgroundColor: alpha(theme.palette[color].main, 0.16)
      }
    };
  };

  return {
    root: {
      padding: theme.spacing(1.5),
      // boxShadow: theme.shadows[25].z8,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.grey[isLight ? 0 : 800],
      backgroundColor: `${theme.palette.grey[isLight ? 900 : 0]} !important`
    },
    icon: {
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(1.5),
      borderRadius: theme.shape.borderRadiusSm,
      '& svg': { width: 24, height: 24 }
    },
    message: {
      padding: 0,
      fontWeight: theme.typography.fontWeightMedium
    },
    action: {
      marginRight: -4,
      '& svg': {
        width: 20,
        height: 20,
        opacity: 0.48,
        '&:hover': { opacity: 1 }
      }
    },
    info: createStyle('info'),
    success: createStyle('success'),
    warning: createStyle('warning'),
    error: createStyle('error')
  };
});

// ----------------------------------------------------------------------

NotistackProvider.propTypes = {
  children: PropTypes.node
};

function NotistackProvider({ children }) {
  const classes = useStyles();

  return (
    <SnackbarProvider
      dense
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      iconVariant={{
        success: (
          <span className={classes.icon}>
            {/* <Icon icon={checkmarkCircle2Fill} /> */}
          </span>
        ),
        error: (
          <span className={classes.icon}>
            {/* <Icon icon={infoFill} /> */}
          </span>
        ),
        warning: (
          <span className={classes.icon}>
            {/* <Icon icon={alertTriangleFill} /> */}
          </span>
        ),
        info: (
          <span className={classes.icon}>
            {/* <Icon icon={alertCircleFill} /> */}
          </span>
        )
      }}
      classes={{
        contentRoot: classes.root,
        message: classes.message,
        action: classes.action,
        variantInfo: classes.info,
        variantSuccess: classes.success,
        variantWarning: classes.warning,
        variantError: classes.error
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

export default NotistackProvider;
