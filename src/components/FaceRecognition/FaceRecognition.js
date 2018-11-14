import React from 'react';
import '../../App.css'
import './FaceRecognition.css';

const faceRecognition = (props) => {
    return (
        <div style={{
            position: 'relative',
            marginLeft: 'auto',
            marginRight:'auto',
            width: props.boxSizes.width,
            height: props.boxSizes.height
        }} className='Center'>
        {props.recogBox.topRow !== '' ? 
                <div 
                    style={{
                    top: props.recogBox.topRow + 'px',
                    left: props.recogBox.leftCol + 'px',
                    bottom: props.recogBox.bottomRow + 'px',
                    right: props.recogBox.rightCol + 'px' 
                    }} 
                    className='RecognitionBox'></div> 
                : null}
        {props.url !== '' ? 
            <img id='faceImg' alt=' ' height='auto' width='auto' className='ImageBox' src={props.url}/> 
            : null}
        </div>
    );
}

export default faceRecognition;