import React from 'react';

function Html() {
  return (
    <html lang="en">
      <head>
        <title>Agency 360 REACT component library</title>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzEw2NaQFixR7sZCLnZ1oGQljW7AxLZ7k&libraries=places" />
        <link rel="stylesheet" href="/styles/vendor.css" />
      </head>
      <body>
        <div id="app" />
        <script src="/assets/react-component-library.min.js" />
      </body>
    </html>
  );
}

export default Html;
