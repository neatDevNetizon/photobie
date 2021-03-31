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
	Zoom
} from '@material-ui/core';
import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import BackupIcon from '@material-ui/icons/Backup';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditLocationRoundedIcon from '@material-ui/icons/EditLocationRounded';
import Preview from './Preview';

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
				}
      }
    }
		fetchUser();
  }, [open]);

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
			'address': e.target.value,
			'status': 1,
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
			'detail':current,
		};
		setSelectedVenue(newVenuedata);
	}
	async function closeListener() {
		setSelectedVenue([]);
		handleClose();
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
          
          <TextField
            variant="outlined"
            className={classes.quizName}
            label="Venue Address"
            value={selectedVenue?.address}
            id="outlined-basic"
						autoFocus
            onChange={(event) => {
              handleTitle(event);
            }}
          />
          <Typography color="warnred" variant="body2" className={classes[valid]}>
            * Please enter at least 3 characters
          </Typography>
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
