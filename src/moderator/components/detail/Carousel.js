import React, { useState, useCallback,useEffect } from "react";


const styles = {
    slideImage:{
      width: "100%",
      height: 200,
      objectFit: "cover",
    },
    
  };
export default function Carousels(props){
    // console.log(props)
    const [currentIndex, setCurrentIndex] = useState(0);
    function slidePrev(){
        setCurrentIndex(currentIndex-1)
    }
    function slideNext(){
        setCurrentIndex(currentIndex+1)
    }
    function onSlideChanged(e){
        setCurrentIndex(e.item)
        console.log(currentIndex)
    }
    return <div style = {{display:"flex",flexDirection:"row"}}>
        {/* <button onClick = {slidePrev}>Prev button</button>
        <button onClick = {slideNext}>Next button</button> */}
        
        {props.imageURL.map((urls,index)=>{
            return <img src = {urls} style = {styles.slideImage} alt="" key = {index}/>
        })}
        
    </div>
}