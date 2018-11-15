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
    isSignIn: false,
    profile: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }

  onInputChangeHandler = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmitHandler = () => {
    console.log('[CURRENTPROFILE]', this.state.profile.id)
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            id: this.state.profile.id 
          })})
          .then(response => response.json())
          .then(data => {
            console.log('[DATA]', data)
            this.setState({
              profile: {
                ...this.state.profile,
                entries: data.entries
              }
            })
        });
      }
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

  loadUser = (user) => {
    this.setState({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      } 
    })
  }
  
  render() {
    console.log('[PROFILE]', this.state.profile);
    const {isSignIn, imgDimenzions, box, imageUrl} = this.state;
    let routes;
    switch (this.state.route) {
      case ('mainpage'):
        routes = (
        <>
        <Navigation isSignIn={isSignIn} routeChange={this.onRouteChangeHandler} />
        <Logo />
        <Rank name={this.state.profile.name} entries={this.state.profile.entries} />
        <ImageLinkForm changed={this.onInputChangeHandler} submited={this.onSubmitHandler}/>
        <FaceRecognition boxSizes={imgDimenzions} recogBox={box} url={imageUrl} />
        </>
        );
        break;  
      case ('signin'):
        routes = (<Signin loadUser={this.loadUser} routeChange={this.onRouteChangeHandler} />);  
        break;
      case ('register'):
        routes = (<Register loadUser={this.loadUser} routeChange={this.onRouteChangeHandler}/>);  
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
