import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  // Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  Menu,
  MenuItem
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import Zoom from 'react-reveal/Zoom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(3)
  },
  quAvatar: {
    width: '100%',
    height: 'auto',
    maxHeight: 200
  },
  hambergerContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  menuItem: {
  },
  menuIcon: {
    marginRight: theme.spacing(1)
  }
}));

const ProductCard = ({
  className, product, indexId, ...rest
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const deleteQu = (index, id) => {
    console.log(index, id);
    handleMenuClose();
  };
  return (
    <Zoom>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardContent>
          <Grid
            container
            flexDirection="row"
            spacing={2}
          >
            <Grid
              item
              xl={3}
              lg={3}
              md={3}
              sm={3}
              xs={5}
            >
              <Avatar
                alt="Product"
                src={product.media === null ? '/static/collection.png' : `http://localhost:3001/upload/${product.media}`}
                variant="square"
                className={clsx(classes.quAvatar, className)}
              />
            </Grid>
            <Grid
              item
              xl={9}
              lg={9}
              md={9}
              sm={9}
              xs={7}
              container
              justifyContent="space-between"
              flexDirection="row"
            >
              <Grid
                item
                xl={11}
                lg={11}
                md={11}
                xs={11}
              >
                <Typography
                  align="left"
                  color="textPrimary"
                  gutterBottom
                  variant="h4"
                >
                  {product.title}
                </Typography>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="body1"
                >
                  {product.description}
                </Typography>
              </Grid>
              <Grid
                item
                xl={1}
                lg={1}
                md={1}
                xs={1}
                className={classes.hambergerContainer}
              >
                <MoreVertIcon
                  onClick={handleMenuClick}
                />
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    key={`${product.id}1`}
                    className={classes.menuItem}
                    onClick={() => deleteQu(indexId, product.id)}
                  >
                    <DeleteIcon className={classes.menuIcon} />
                    Delete from collection
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Zoom>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
  indexId: PropTypes.number
};

export default ProductCard;
