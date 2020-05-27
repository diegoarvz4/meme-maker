import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {

  const refSVG = useRef(null);
  const [base64IMG, setBase64IMG] = useState(null);
  const [widthIMG, setWidthIMG] = useState(null);
  const [heightIMG, setHeightIMG] = useState(null);
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');

  useEffect(() => {

    fetch('https://api.imgflip.com/get_memes')
      .then(res => res.json())
      .then(res => {
        const memes = res.data.memes;
        const index = Math.floor(Math.random() * memes.length);
        console.log(res.data.memes[index])
        getBase64Image(res.data.memes[index].url);
      })
      .catch(error => console.log(error))
  }, []);

  useEffect(() => {
    const base_image = new Image();
    base_image.src = base64IMG;
    var wrh = base_image.width / base_image.height;
    setWidthIMG(base_image.width);
    setHeightIMG(base_image.height);
  }, [base64IMG]);


  const convertSvgToImage = () => {
    const svg = refSVG.current;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function () {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }

  const getBase64Image = (src) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = src;
    image.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalHeight;
      context.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      setBase64IMG(dataURL);
    }
  }


  return (
    <div className="App">
      <svg
        width={widthIMG}
        height={heightIMG}
        ref={refSVG}
      >
        {
          base64IMG
            ? <image
              width={widthIMG}
              height={heightIMG}
              xlinkHref={base64IMG ? base64IMG : null}
            />
            : null
        }
        <text
          x="45%"
          y="10%"
          style={
            {
              fontFamily: "Impact",
              fontSize: "50px",
              textTransform: "uppercase",
              fill: "#FFF",
              stroke: "#000",
              userSelect: "none"
            }
          }
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {topText}
        </text>
        <text
          x="45%"
          y="90%"
          style={
            {
              fontFamily: "Impact",
              fontSize: "50px",
              textTransform: "uppercase",
              fill: "#FFF",
              stroke: "#000",
              userSelect: "none"
            }
          }
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {bottomText}
        </text>
      </svg>
      <button onClick={() => convertSvgToImage()} className="btn btn-primary">Download Meme!</button>
      <input value={topText} onChange={(e) => setTopText(e.target.value)} />
      <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
    </div >

  );
}

export default App;
