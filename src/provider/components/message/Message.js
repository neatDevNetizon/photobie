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
// Amplify.configure(awsExports);
function Message() {
    const [user, setUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const [chatClient, setChatClient] = useState([]);
    const [receiver, setReceiver] = useState("");
    const handleChange = (event) => {
      setMessageBody(event.target.value);
    };
    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    const handleListItemClick = async(event, index, receiver) => {
      
      setMessages([]);
      setSelectedIndex(index);
      setReceiver(receiver);
      var message = null;
      await API
        .graphql(graphqlOperation(queries.listMessages, {
          sortDirection: 'ASC',
          filter: { author: { eq: user }, receiver:{eq:receiver}},
          // { receiver: { eq: user }, author:{eq:receiver}}
          
        }))
        .then((response) => {
          const items = response?.data?.listMessages?.items;
          if (items) {
            message = items;
          }
        })
        await API
        .graphql(graphqlOperation(queries.listMessages, {
          sortDirection: 'ASC',
          filter: { receiver: { eq: user }, author:{eq:receiver}}
          
        }))
        .then((response) => {
          const items = response?.data?.listMessages?.items;
          if (items) {
            // console.log(message)
            // setMessages(items);
            message.push(...items)
            console.log(message)
            var mmm = message
            mmm.sort(function(a, b){
             var aa = new Date(a.createdAt)
             var bb = new Date(b.createdAt)
             if(aa<bb){
               return -1
             } else if (aa>bb){
               return 1
             } else {
               return 0
             }
            })
            console.log(mmm)
            setMessages(mmm)
          }
        })
    };
    useEffect(() => {
      async function fetchData() {
        const user =await Auth.currentUserInfo()
        if(!user){
          window.location.href = "/"
        } else {
          setUser(user.attributes.email);
          switch(user.attributes["custom:type"]*1){
            case 2: 
              const eventlist2 = await API
                .graphql(graphqlOperation(queries.listUserss, { filter: {
                  type: {eq:4} 
                }}));
              var chatClientsList1 = eventlist2.data.listUserss.items
              const eventlist1 = await API
                .graphql(graphqlOperation(queries.listUserss, { filter: {
                  type: {eq:3} 
                }}));
              var chatClientsList2 = eventlist1.data.listUserss.items
              var chatClientList = chatClientsList1.concat(chatClientsList2)
              setChatClient(chatClientList)
              break;
            case 3:
              console.log(3)
              break;
            case 4:
              
              break;
          }
        }
      }
      fetchData()
    },[]);
    useEffect(() => {
      API
        .graphql(graphqlOperation(messagesByChannelId, {
          channelID: "1",
          sortDirection: 'ASC',
          filter: {
            author: {eq:receiver},
            receiver:{eq:user}
          }
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
      if(messageBody.trim()=="")return ;
      const input = {
        channelID: '1',
        author: user,
        body: messageBody.trim(),
        receiver: receiver,
        status:1
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
            <div className="search__container">
              <input className="search__input" type="text" placeholder="Search"/>
            </div>
          </ListItem>
        </List>
        <Divider />
        <List component="div" aria-label="secondary mailbox folders" className = "chatClients" id = "style-7">
          {chatClient.map((item, index)=>{
            return <ListItem 
            button
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index, item.email)}
            key = {index}
            >
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.email} secondary="Jan 9, 2014" />
            </ListItem>
          })}
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
                    className={message.author === user ? 'mes-message me' : 'mes-message'}>{message.body}</div>
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