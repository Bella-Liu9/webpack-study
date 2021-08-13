import "./index.scss";
import imgTets from "./assets/2021-1-1.png";
class Hello {
  constructor() {
    console.log("hello webpack!");
  }

  renderImg() {
    const img = document.createElement("img");
    img.src = imgTets;
    document.body.appendChild(img);
  }
}

const test = new Hello();
test.renderImg();
