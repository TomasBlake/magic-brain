import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const apiKey = 'e6ba4dbd0dd3440fa40908bded52a24d'; 
const app = new Clarifai.App({
  apiKey: apiKey
});

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  
  state = {
    input: '',
    imageUrl: '',
    box: {
      topRow: '',
      leftCol: '',
      bottomRow: '',
      rightCol: ''
    },
    imgDimenzions: {
      width: '',
      height: ''
    },
    route: 'signin',
    isSignIn: false
  }

  onInputChangeHandler = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmitHandler = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => {
    console.log('[RESPONSE]', response.outputs[0].data.regions[0].region_info.bounding_box)
    this.calculateFaceLocation(response)})
    .catch(err => console.log(err));
  }

  calculateFaceLocation = (data) => {
    const extractedData = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('faceImg');
    const width = Number(image.width);
    const height = Number(image.height);
    const boxForState = {
      topRow: extractedData.top_row * height,
      leftCol: extractedData.left_col * width,
      bottomRow: height - (extractedData.bottom_row * height),
      rightCol: width - (extractedData.right_col * width)
    }
    this.setState({
      box: boxForState,
      imgDimenzions: {
        width: width,
        height: height
      }
    });
  }

  onRouteChangeHandler = (route) => {
    if (route === 'signin' || route === 'register') {
      this.setState({isSignIn: false})
    } else {
      this.setState({isSignIn: true})      
    }
    this.setState({route: route})
  }
  
  render() {
    const {isSignIn, imgDimenzions, box, imageUrl} = this.state;
    let routes;
    switch (this.state.route) {
      case ('mainpage'):
        routes = (
        <>
        <Navigation isSignIn={isSignIn} routeChange={this.onRouteChangeHandler} />
        <Logo />
        <Rank />
        <ImageLinkForm changed={this.onInputChangeHandler} submited={this.onSubmitHandler}/>
        <FaceRecognition boxSizes={imgDimenzions} recogBox={box} url={imageUrl} />
        </>
        );
        break;  
      case ('signin'):
        routes = (<Signin routeChange={this.onRouteChangeHandler} />);  
        break;
      case ('register'):
        routes = (<Register routeChange={this.onRouteChangeHandler}/>);  
        break;
      default:
        routes = ( 
        <>
        <Navigation isSignIn={isSignIn} routeChange={() => this.onRouteChangeHandler('signin')} />
        <Logo />
        <Rank />
        <ImageLinkForm changed={this.onInputChangeHandler} submited={this.onSubmitHandler}/>
        <FaceRecognition boxSizes={imgDimenzions} recogBox={box} url={imageUrl} />  
        </>
        );
        break;
    }

    return (
      <div className="App">
        {routes}
        <Particles className='Particles'
          params={particlesOptions}
         />
      </div>
    );
  }
}

export default App;
