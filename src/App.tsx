import React from "react";
import imageUrl from "./assets/2021-1-1.png";

const App = (): React.ReactElement => {
  return (
    <div>
      <p>App content</p>
      <img src={imageUrl} alt="" />
    </div>
  );
};

export default App;
