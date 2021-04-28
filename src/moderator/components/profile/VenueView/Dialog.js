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
	IconButton,
	Tooltip,
	Zoom,
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
import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import BackupIcon from '@material-ui/icons/Backup';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditLocationRoundedIcon from '@material-ui/icons/EditLocationRounded';
import Preview from './Preview';
import load from 'little-loader';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import LocationSearchInput from './PlaceDropDown';
import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input';

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
		marginTop: 5
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

  async function handleImageChange(index, e) {
		console.log(index)
    if (e.target.files[0]) {
      const file = e.target.files[0];
      var filesArr = Array.prototype.slice.call(e.target.files);
      const fileType = filesArr[0];
      e.preventDefault();
      var d = new Date();
      var n = d.getTime();
      const picture = n+"-"+fileType.name;
			console.log(picture, index);
			let current = selectedVenue.detail;
			let newArr = [];
			
			for(let i=0; i<current.length; i++){
				if(i===index){
					newArr.push({
						'media': picture,
						'detail': current[i].detail,
						'fileName': fileType.name
					});
				} else {
					newArr.push({
						'media': current[i].media,
						'detail':current[i].detail,
						'fileName':current[i].fileName
					});
				}
			}
			const newVenuedata = {
				'address': selectedVenue.address,
				'status': selectedVenue.status,
				'phone':selectedVenue.phone,
				'eventype': selectedVenue.eventype,
				'detail':newArr,
			};
			setSelectedVenue(newVenuedata);
      const realName = await Storage.put(picture, file, {
        contentType: fileType.type,
        level: 'public'
      });
			
      // const reader = URL.createObjectURL(e.target.files[0]);
      // setImageSource(reader);
    }
  }
  const handleOpenUpload = (index) => {
    document.getElementById('image_select_'+index).click();
  }
  async function handleDetail(index, value){
		let current = selectedVenue.detail;
			let newArr = [];
			for(let i=0; i<current.length; i++){
				if(i===index){
					newArr.push({
						'media': current[i].media,
						'detail': value,
						'fileName': current[i].fileName
					});
				} else {
					newArr.push({
						'media': current[i].media,
						'detail':current[i].detail,
						'fileName':current[i].fileName
					});
				}
			}
			const newVenuedata = {
				'address': selectedVenue.address,
				'status':selectedVenue.status,
				'phone':selectedVenue.phone,
				'eventype': selectedVenue.eventype,
				'detail':newArr,
			};
			setSelectedVenue(newVenuedata);

  }
  function handlePreview(){
    setViewMode(2)
  }
  function changeModeGrid(){
    setViewMode(1)
  }
	const handleTitle = (e) => {
		let current = selectedVenue?.detail;
		const newVenuedata = {
			'address': e,
			'status': 1,
			'phone':selectedVenue.phone,
			'eventype': selectedVenue.eventype,
			'detail':current?current:[],
		};
		////////==================================================
		setSelectedVenue(newVenuedata);
	}
  async function handleNew() {
		setIsLoading(true);
		if(status === ''){
			let current = [...venues];
			current.push(selectedVenue);
			await API.graphql(graphqlOperation(mutations.updateUsers, {input: {
				id: userId,
				venues: JSON.stringify(current)
			}}));
			
			const indexId = current.length - 1;
			const data = {
				user:userId,
				addname: current[indexId].address,
				indexid:indexId,
				type:1,
				read:1,
				status:1,
			}
			await API.graphql(graphqlOperation(mutations.createRequestToAdmin, {input: data})).then((res) => {
				console.log(res);
			});
			
			onCreateRequest();
			refreshFunc();
			closeListener();
			
		} else {
			let current = [...venues];
			let newArr=[];
			for(let i=0; i<current.length; i++){
				if(i===status){
					newArr.push(selectedVenue);
				} else {
					newArr.push(current[i]);
				}
			}
			console.log('Modify', selectedVenue.status, status);
			await API.graphql(graphqlOperation(mutations.updateUsers, {input: {
				id: userId,
				venues: JSON.stringify(newArr)
			}}));
			const request = await API.graphql(graphqlOperation(queries.listRequestToAdmins, {filter: {
				user: {eq: userId},
				indexid: {eq: status}
			}}));
			
			await API.graphql(graphqlOperation(mutations.updateRequestToAdmin, {input: {
				id:request?.data?.listRequestToAdmins?.items[0].id,
				addname:selectedVenue.address,
				status:selectedVenue.status
			}})).then((res)=>{console.log("aaaa", res)});
			// await onChangeRequest();
			refreshFunc();
			closeListener();
		}
		setIsLoading(false);
  }
	async function onCreateRequest() {
		const subscription = API
			.graphql(graphqlOperation(subscriptions.onCreateRequestToAdmin))
			.subscribe({
				next: (event) => {
					console.log("asdfadf", event)
				}
			});
		return () => {
			subscription.unsubscribe();
		}
	}
	async function onChangeRequest() {
		// const subscription = API
		// 	.graphql(graphqlOperation(subscriptions.onUpdateUsers))
		// 	.subscribe({
		// 		next: (event) => {
		// 			// setEvents([...events, event.value.data.onCreateEvents]);
		// 		}
		// 	});
		// return () => {
		// 	subscription.unsubscribe();
		// }
	}
  const addNew = () => {
		setViewMode(1);
    if(selectedVenue.length===0){
			const data = {
        'address':'',
				'status':1,
				'phone':'',
        'detail': [
          {
            'media': '',
            'detail':'',
						'fileName':''
          }
        ]
      };
      setSelectedVenue(data);
		} else {
			let current = selectedVenue.detail;
			current.push({
				'media': '',
				'detail':'',
				'fileName':''
			});
			const newVenuedata = {
				'address': selectedVenue.address,
				'status':selectedVenue.status,
				'phone':selectedVenue.phone,
				'eventype': selectedVenue.eventype,
				'detail':current,
			};
			setSelectedVenue(newVenuedata);
		}
  }
	const handleDelete = (index) =>{
		let current = selectedVenue.detail;
		current.splice(index, 1);
		const newVenuedata = {
			'address': selectedVenue.address,
			'status': selectedVenue.status,
			'phone':selectedVenue.phone,
			'eventype': selectedVenue.eventype,
			'detail':current,
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
						<Grid xs={12} sm={6} md={6} className={classes.buttonGroup}>
							<Tooltip title="Add" arrow TransitionComponent={Zoom}>
								<IconButton color="primary">
									<AddIcon onClick = {addNew}/>
								</IconButton>
							</Tooltip>
							<Tooltip title="Edit" arrow TransitionComponent={Zoom}>
								<IconButton color="primary">
									<EditLocationRoundedIcon onClick = {changeModeGrid} />
								</IconButton>
							</Tooltip>
							<Tooltip title="Preview" arrow TransitionComponent={Zoom}>
								<IconButton color="primary">
									<VisibilityIcon onClick = {handlePreview} />
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
					<LocationSearchInput 
						valueAddress={selectedVenue?.address}
						onChangeAddress={value => handleTitle(value)}
					/>
					<Typography color="warnred" variant="body2" className={classes[valid]}>
            * Please enter at least 3 characters
          </Typography>
					<PhoneInput
						placeholder="Enter phone number..."
						value={selectedVenue?.phone}
						autocomplete
						defaultCountry="US"
						onChange={(event) => { onChangePhoneNumber(event); }}
					/>
					
					{/* dfadfadsfadsf -----------------------------------------------------*/}
					<FormControl className={classes.formControl} variant="outlined" >
						<InputLabel htmlFor="outlined-age-native-simple" id="demo-mutiple-chip-label">Selectable Event Types</InputLabel>
						<Select
							labelId="demo-mutiple-chip-label"
							id="demo-mutiple-chip"
							multiple
							// style = {{minWidth:300, }}
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
						{viewMode===1?<div>
							{selectedVenue?.detail?.map((item, index)=>{
								return <Grid container xs={12} spacing ={2}>
									<Grid item xs={11} md={5} sm={6}>
										<div className={classes.uploadContainer}>
											<div className={classes.uploadButton}>
												<BackupIcon color="primary" onClick={()=>{handleOpenUpload(index);}}/>
											</div>
											<input type="file"
												id={"image_select_"+index}
												onChange={(event) => {
													handleImageChange(index, event);
												}}
												className={classes.fileModal} 
											/>
											<Typography className={classes.fileName}>{item.fileName}</Typography>
										</div>
									</Grid>
									<Grid item xs={11} md={5} sm={5}>
										<TextField
											variant="outlined"
											// className={classes.quizName}
											label="Detail data"
											value={item.detail}
											fullWidth
											id="outlined-basic"
											onChange={(event) => {
												handleDetail(index, event.target.value);
											}}
										/>
									</Grid>
									<Grid item xs={1} md={1} sm={1}>
										<Tooltip title="Delete" arrow TransitionComponent={Zoom}>
											<IconButton aria-label="delete" onClick={()=> {handleDelete(index);}}>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</Grid>
								</Grid>
            })}</div>:<div className={classes.previewGrid}><Grid container xs={12} spacing={3}>
							{selectedVenue?.detail?.map((item, index)=>{
								return <Grid item xs={6} sm={6} md={6}>
									<Preview media={item.media} detail={item.detail} key={index}/>
								</Grid>
							})}</Grid>
						</div>
						}
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeListener} variant="contained" disabled={isLoading} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleNew} disabled={isLoading} color="secondary" autoFocus>
            Save
            {' '}
            {isLoading && <ButtonCircularProgress color="nice" />}
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
