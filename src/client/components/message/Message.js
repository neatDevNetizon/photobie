import React, { useState, useCallback,useEffect } from "react";
import "./message.css";
import * as queries from '../../../graphql/queries';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import { createMessage } from '../../../graphql/mutations';
import { onCreateMessage } from '../../../graphql/subscriptions';
import { messagesByChannelId } from '../../../graphql/queries';
import awsExports from '../../../aws-exports';
import SendIcon from '@material-ui/icons/Send';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AttachFileIcon from '@material-ui/icons/AttachFile';
Amplify.configure(awsExports);
function Message() {
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const handleChange = (event) => {
      setMessageBody(event.target.value);
    };
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
    useEffect(() => {
      async function fetchData() {
        const user =await Auth.currentUserInfo()
        console.log(user)
        if(!user){
          window.location.href = "/"
        } else if (user.attributes["custom:type"]!="1"){
          switch(user.attributes["custom:type"]){
            case "1":
              window.location.href = "/c/dashboard"
              break;
            case "2":
              window.location.href = "/p/dashboard"
              break;
            case "3":
              window.location.href = "/m/dashboard"
              break;
            case "4":
              window.location.href = "/a/dashboard"
              break;
          }
        }
      }
      fetchData()
    },[]);
    useEffect(() => {
      API
        .graphql(graphqlOperation(messagesByChannelId, {
          channelID: '1',
          sortDirection: 'ASC'
        }))
        .then((response) => {
          const items = response?.data?.messagesByChannelID?.items;
          if (items) {
            setMessages(items);
          }
        })
    }, []);

    useEffect(() => {
      const subscription = API
        .graphql(graphqlOperation(onCreateMessage))
        .subscribe({
          next: (event) => {
            setMessages([...messages, event.value.data.onCreateMessage]);
          }
        });
  
      return () => {
        subscription.unsubscribe();
      }
    }, [messages]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      event.stopPropagation();
    
      const input = {
        channelID: '1',
        author: 'Dave',
        body: messageBody.trim()
      };
    
      try {
        setMessageBody('');
        await API.graphql(graphqlOperation(createMessage, { input }))
      } catch (error) {
        console.warn(error);
      }
    };

    function fadeInSideBar(){
      var v = document.getElementById("leftSideBox").style.display;
      console.log(v)
      v=="none"?document.getElementById("leftSideBox").style.display="block":document.getElementById("leftSideBox").style.display = "none";
    }
    return (
      <div className = "chatBox">
        <div className = "leftSideBox" id = "leftSideBox">
        <List component="nav" aria-label="main mailbox folders">
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
                
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem >
            <div class="search__container">
              <input class="search__input" type="text" placeholder="Search"/>
            </div>
          </ListItem>
        </List>
        <Divider />
        <List component="div" aria-label="secondary mailbox folders" className = "chatClients" id = "style-7">
          <ListItem 
          button
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem button
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem button
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem 
          button
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
        </List>
        </div>
        <div className = "rightSideBox" id="style-7">
          {/* <button className = "hamburger" onClick = {fadeInSideBar}>view</button> */}

          <div className="mes-container">
            <div className="mes-messages">
              <div className="mes-messages-scroller">
              {messages.map((message) => (
                <div
                    key={message.id}
                    className={message.author === 'Dave' ? 'mes-message me' : 'mes-message'}>{message.body}</div>
                ))}
              </div>
            </div>
            <div className="mes-chat-bar">
              <form onSubmit={handleSubmit} style = {{display:"flex", flexDirection:"row", alignItems:"center"}}>
                <input
                  type="text"
                  name="messageBody"
                  placeholder="Type your message here"
                  onChange={handleChange}
                  value={messageBody}
                />
                <AttachFileIcon/>
                <SendIcon style = {{marginLeft:10,marginRight:10}}/>
                
              </form>
            </div>
          </div>
        </div>
      </div>
     
    );
  };
  
  export default Message;