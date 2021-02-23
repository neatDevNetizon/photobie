import React, {useState, useEffect}from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paying from "./Paying"
import MessageModal from "./MessageModal"

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const tiers = [
  {
    title: 'Plus',
    tokens:"2000",
    price: '20',
    description: ['2000 tokens', ],
    buttonText: 'Get 2000 token',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '50',
    tokens:"5000",
    description: [
      "5000 tokens"
    ],
    buttonText: 'Get 5000 token',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '100',
    tokens:"10000",
    description: [
      "10000 tokens"
    ],
    buttonText: 'Get 10000 token',
    buttonVariant: 'outlined',
  },
  {
    title: 'Premier',
    price: '200',
    tokens:"20000",
    description: [
      "20000 tokens"
    ],
    buttonText: 'Get 20000 token',
    buttonVariant: 'outlined',
  },
];

export default function Pricing() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [messageOpen, setMessageOpen] = useState(false);
    const [tokenNums, setTokenNums]= useState(0)
    async function openPayDialog(val, tokenNum){
        setPrice(val*1);
        setTokenNums(tokenNum*1)
        setOpen(true)
    }
    function handleClose(){
        setOpen(false)
    }
    function results(){
        setMessageOpen(true)
    }
    function messageClose(){
        setMessageOpen(false)
    }
    return (
        <React.Fragment>
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Pricing
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
                You can get tokens to uptick
            </Typography>
        </Container>
        <Container  component="main">
            <Grid container spacing={5} alignItems="flex-end">
            {tiers.map((tier) => (
                <Grid item key={tier.title} sm={6} md={3} xs = {12}>
                <Card>
                    <CardHeader
                    title={tier.title}
                    subheader={tier.subheader}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    action={tier.title === 'Pro' ? <StarIcon /> : null}
                    className={classes.cardHeader}
                    />
                    <CardContent>
                    <div className={classes.cardPricing}>
                        <Typography component="h4" variant="h4" color="textPrimary">
                        {tier.tokens}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                        /${tier.price} USD
                        </Typography>
                    </div>
                    <ul>
                        {tier.description.map((line) => (
                        <Typography component="li" variant="subtitle1" align="center" key={line}>
                            {line}
                        </Typography>
                        ))}
                    </ul>
                    </CardContent>
                    <CardActions>
                    <Button fullWidth variant={tier.buttonVariant} onClick = {()=>openPayDialog(tier.price, tier.tokens)} color="primary">
                        {tier.buttonText}
                    </Button>
                    </CardActions>
                </Card>
                </Grid>
            ))}
            </Grid>
        </Container>
        <MessageModal open = {messageOpen} onClose = {messageClose}/>
        <Paying open = {open} onClose = {handleClose} price = {price} tokenNum = {tokenNums} results = {results}/>
        </React.Fragment>
  );
}