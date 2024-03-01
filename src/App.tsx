import * as React from "react";
import Main from './pages/Main/Main';
import myImage1 from './assets/num1.png'; 
import myImage2 from './assets/num2.png';

function App() {
  
  const [myImage3, setMyImage3] = React.useState(null);

  const handleImageLoad = () => {
    import('./assets/num3.png').then(imageModule => {
      setMyImage3(imageModule.default);
    });
  };

  return (
    <>
      <Main/>
      <div>branch cicd test</div>
      <img src={myImage1} alt="My Image" />
      <img src={myImage2} alt="My Image" />
      {myImage3 && <img src={myImage3} alt="My Image" />}
      <button onClick={handleImageLoad}>Load Image 3</button>
    </>
  );
}

export default App;