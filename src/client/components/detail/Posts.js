import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import PostContent from "./PostContent";
import AddPost from "./AddPost";

function Posts(props) {
  const handle  = props.location.search;
  const id = new URLSearchParams(handle).get('id');
  const {
    selectPosts,
    EmojiTextArea,
    ImageCropper,
    Dropzone,
    DateTimePicker,
    pushMessageToSnackbar,
    posts,
    setPosts,
  } = props;
  const [isAddPostPaperOpen, setIsAddPostPaperOpen] = useState(false);

  const openAddPostModal = useCallback(() => {
    setIsAddPostPaperOpen(true);
  }, [setIsAddPostPaperOpen]);

  const closeAddPostModal = useCallback(() => {
    setIsAddPostPaperOpen(false);
  }, [setIsAddPostPaperOpen]);

  useEffect(() => {
    selectPosts();
    // console.log(id)
  }, [selectPosts]);
 
  return <PostContent
    posts={posts}
    setPosts={setPosts}
    pushMessageToSnackbar={pushMessageToSnackbar}
    id = {id}
  />
}

Posts.propTypes = {
  EmojiTextArea: PropTypes.elementType,
  ImageCropper: PropTypes.elementType,
  Dropzone: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPosts: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  selectPosts: PropTypes.func.isRequired,
};

export default Posts;
