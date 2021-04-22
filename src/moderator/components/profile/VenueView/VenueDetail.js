import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import * as mutations from '../../../../graphql/mutations';
import * as queries from '../../../../graphql/queries';
import * as subscriptions from '../../../../graphql/subscriptions'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  makeStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Grid,
	Input,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Chip,
	useTheme
} from '@material-ui/core';
import Preview from './Preview';
import LocationSearchInput from './PlaceDropDown';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';

const useStyles = makeStyles((theme) => ({
  venueDialog: {
    minHeight: '90vh',
    height: '90vh',
    marginTop: '5vh'
  },
  fileModal: {
    display: 'none',
    
  },
  uploadButton: {
    border: '1px solid #ccc',
    display: 'flex',
		alignItems: 'center',
    padding: '6px 12px',
    cursor: 'pointer',
		height:'100%'
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
		height: '100%'
  },
  quizName: {
    width: '100%',
    minWidth: 250,
    marginTop: 10
  },
  none: {
    display: 'none'
  },
  valid: {
    display: 'block',
    color: 'red'
  },
  venueContainer: {
    height:'80vh'
  },
	fileName: {
		marginLeft:3,
		textOverflow: 'ellipsis',
    width: '100%',
    overflow: 'hidden',
		marginTop:10,
		whiteSpace: 'nowrap'
	},
	buttonGroup: {
		display: 'flex',
		justifyContent:'flex-end'
	},
	previewGrid:{
		display: 'flex',
		justifyContent:'center'
	},
	chips:{
    whiteSpace:"normal"
  },
	chip:{
    margin:2,
  },
  main: {
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
    },
    [theme.breakpoints.up("sm")]: {
        marginLeft: 200,
    },
  },
	formControl: {
		width: '100%',
		textAlign: 'center',
		marginTop: 15
	}
}));

const Toolbar = ({ className, open, handleClose, status,refreshFunc, ...rest }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [valid, setValid] = useState('none');
  const [newTitle, setNewTitle] = useState('');
  const [selectedVenue, setSelectedVenue] = useState([]);
	const [userId, setUserId] = useState('');
	const [venues, setVenues] = useState([]);
	const [viewMode, setViewMode] = useState(1);
	const [phoneNumber, setPhoneNumber] = useState()
	const theme = useTheme();
	const [typeList, setTypeList] = useState([]);
	const [personName, setPersonName] = useState([]);

	const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
	const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else if(open){
        const email = user.attributes.email;
        const userToken = await API.graphql(graphqlOperation(queries.listUserss, {filter:{email:{eq:email}}}))
        setUserId(userToken.data.listUserss?.items[0]?.id);
				const venueList = userToken.data.listUserss?.items[0]?.venues;
				if(venueList){
					setVenues(JSON.parse(venueList));
				} else console.log('none');
				if(status!==''&&open){
					setSelectedVenue(JSON.parse(venueList)[status])
					setPersonName(JSON.parse(venueList)[status]?.eventype?JSON.parse(venueList)[status]?.eventype.split(","):[]);
				}
				await API.graphql(graphqlOperation(queries.listEventTypes)).then((res)=>{
          const typeData = res.data.listEventTypes.items;
          let newArr = [];
          for(let i=0; i<typeData.length; i++){
            newArr.push({
              id: typeData[i].id,
              name: typeData[i].typename
            })
          }
          setTypeList(newArr);
        });
      }
    }
		fetchUser();
  }, [open]);
	function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

	const handleChangeFavor = (event) => {
    if(event.target.value.length>5){
      return false;
    }
    setPersonName(event.target.value);
		const newVenuedata = {
			'address': selectedVenue.address,
			'status': selectedVenue.status,
			'phone':selectedVenue.phone,
			'eventype': selectedVenue.eventype,
			'eventype':event.target.value.toString(),
			'detail':selectedVenue.detail,
		};
		console.log(newVenuedata)
		setSelectedVenue(newVenuedata);
  };

	const handleTitle = (e) => {
		let current = selectedVenue?.detail;
		const newVenuedata = {
			'address': e,
			'status': 1,
			'phone':selectedVenue.phone,
			'eventype': selectedVenue.eventype,
			'detail':current?current:[],
		};
		setSelectedVenue(newVenuedata);
	}
  
	async function closeListener() {
		setSelectedVenue([]);
		handleClose();
		setPhoneNumber('');
		setPersonName([]);
	}
	const onPlaceChange = (value) => {
		console.log(value);
	}
	
	const onChangePhoneNumber = (event) => {
		const newVenuedata = {
			'address': selectedVenue.address,
			'status': selectedVenue.status,
			'phone':event,
			'eventype': selectedVenue.eventype,
			'detail':selectedVenue.detail,
		};
		setSelectedVenue(newVenuedata);
	}
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
        className={classes.venueDialog}
      >
        <DialogTitle id="alert-dialog-title">
					<Grid container>
						<Grid xs={12} sm={6} md={6}>
							<Typography variant='h5'>
								Venue detail
							</Typography>
						</Grid>
					</Grid>
					<LocationSearchInput 
						valueAddress={selectedVenue?.address}
						onChangeAddress={value => handleTitle(value)}
						disabled={true}
					/>
					<PhoneInput
						placeholder="Enter phone number..."
						value={selectedVenue?.phone}
						autocomplete
						onChange={(event) => { onChangePhoneNumber(event); }}
						disabled
					/>
					<FormControl className={classes.formControl} variant="outlined" >
						<InputLabel htmlFor="outlined-age-native-simple" id="demo-mutiple-chip-label">Selected Event Types</InputLabel>
						<Select
							labelId="demo-mutiple-chip-label"
							id="demo-mutiple-chip"
							multiple
							disabled
							style={{whiteSpace:"none", minWidth:220}}
							value={personName}
							size = {5}
							onChange={handleChangeFavor}
							input={<Input id="select-multiple-chip"  />}
							renderValue={(selected) => (
								<div className={classes.chips}>
									{selected.map((value) => (
										<Chip key={value}  label={value} className={classes.chip} />
									))}
								</div>
							)}
							MenuProps={MenuProps}
						>
							{typeList.map((list, index) => (
								<MenuItem key={list.id} name = {list.id} value={list.name} style={getStyles(list.name, personName, theme)}>
									{list.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
          
        </DialogTitle>
        <DialogContent className={classes.venueContainer}>
          <DialogContentText id="alert-dialog-description">
					<div>
							<div className={classes.previewGrid}><Grid container xs={12} spacing={3}>
							{selectedVenue?.detail?.map((item, index)=>{
								return <Grid item xs={6} sm={6} md={6}>
									<Preview media={item.media} detail={item.detail} key={index}/>
								</Grid>
							})}</Grid>
						</div>
					</div>
						
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeListener} variant="contained" disabled={isLoading} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
	status: PropTypes.string,
	refreshFunc: PropTypes.func
};

export default Toolbar;
