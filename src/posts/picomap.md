---
title: Picomap — the smallest JS web map
date: "2024-07-11"
slug: picomap
tags: gis
---

Picomap — the smallest JS web map
=================================
Introduction
------------

In my last series, I wrote a minimal raster tile server. We will now expand the project to the frontend by writing the smallest JS web map that I am aware of (please correct me if I am wrong) in under 100 lines of native js.
Let us start by some basics. A map client is a way to display a map to the user. For this project, I spied on the most popular map clients (google maps, leaflet, mapbox, openlayers). I decided to mock leaflet because I am most familiar with leaflet, plus leaflet is the only one of the libraries listed that does not render the map on a canvas element, but instead uses multiple nested div elements. This sounded more simple for me so I went with it.

Minimum requirements
--------------------

I had the following minimum requirements for my map client:

*   The map should display a map of set width and height
*   The user should be able to set the initial coordinates of the map
*   The user should be able to navigate on the map
*   The user should be able to zoom in and out on the map.

Structure
---------

With the requirement specification in mind I came up with the following structure displayed in an XML fashion.

```
<Container>
  <MapLayer>
    <Tile></Tile>
    ...
    <Tile></Tile>
  </MapLayer>
  <ControlLayer>
    <ButtonUp></ButtonUp>
    <ButtonLeft></ButtonLeft>
    <ButtonRight></ButtonRight>
    <ButtonDown></ButtonDown>
    <ZoomIn></ZoomIn>
    <ZoomOut></ZoomOut>  
  </ControlLayer>
</Container>
```

The Tile elements are img elements, the buttons naturally button elements and all else div elements.
The MapLayer and ControlLayer both have position absolute so they are displayed on top of each other.

Problem solving
---------------

I was now faced with the following problems:

1.  What is the tile number of the current position?
2.  On what pixel (approximately) is the current position on the tile?
3.  How should these tiles be positioned so that the current position is in the middle
4.  How many tiles should be rendered?
5.  How to zoom in and out
6.  How to move around

Let’s solve these together. I tried to keep the explanations compact and I am planning on writing a while dedicated article on webMercator.

1: To solve the tile number of a given position we need the longitude, latitude and desired zoom level. Tiles are usually denoted in z/x/y format, where z is the zoom level and x and y are the x and y coordinates. In web mercator the whole world is displayed as a square and depending on the zoom level, this square is divided to 2^z tiles. The x and y coordinates range from 0 to ^2.
Fetching the tile’s x-coordinate is straightforward:

```
const lon2tile = (lon, zoom) => Math.floor(relLon(lon) * 2 ** zoom);
```

We first calculate the relative longitude and latitude on the whole webmercator map (between 0 and 1). Calculating the relative longitude is simple. we get it by dividing (lon+180)/360. We use lon+180 here because we use the webMercator convention of displaying longitude as a value of [-180,180]. To get the correct tile number, we multiply the relative longitude with the amount of tile columns on the current zoom level (2**zoom) and take Math.floor to get the tile number as an integer.

Getting the tile’s y coordinate is not as straightforward. This has to do with the conformal nature of the webmercator projection. In order to retain conformity, the latitudal distances get more distorted the more north and south we move from the equator. The distortion is non linear (1/cos(φ) == sec(φ) to be precise, where φ is the latitude). So to get the relative position on the y axis on the webmercator map, we have to integrate the secant, with the [integral of the secant](https://en.wikipedia.org/wiki/Integral_of_the_secant_function) function
we get

```
const relLat = lat => ((1 -Math.log(Math.tan((lat * Math.PI / 180) / 2 + Math.PI / 4)) /Math.PI) /2)
const lat2tile = (lat, zoom) => Math.floor(relLat(lat) * 2 ** zoom);
```

We first convert the latitudes to radians by multiplying the latitude with Math.PI/180. We then calculate the integral of the secant with Math.log(Math.tan(φ/2+Math.PI/4)). We then get the relative position by dividing the secant with pi and lastly we convert from a center based coordinate to a top based coordinate and as with the x coordinate we multiply with the amount of tiles and use Math.floor to get the closest integer rounded down.

2: Now that we know the tile coordinates, whe also need the pixel coordinates on the tile of the current position. For this we determine first the amount of pixels on the whole map on a given zoom level and then we use the same functions as in 1 to get the relative position on thewebmercator map. We then multiply the relative position with the number of pixels on a given zoom level. Round it down and calculate modulo 256 to get the position on the current tile.

3: To get the map to be centered around the current position I decided to build the map view so that the current tile is placed in the middle of the map (the center point of the map and the tile are the same). We then offset the map layer, which is a div containing all the displayed tiles by a difference between the enter point of the tile and the pixel coordinates of the current position calculated previously.

4: We place the tile of the curren position in the middle of the map so we need the same amount of tiles on the both sides of the current tile both horizonally and vertically. The map layer has the overflow hidden style property, so any tiles outside the map layer are not displayed. Calculating the amount of tiles needed is a simple function

```
const nTiles = length => Math.ceil((length/2 - 128) / 256)+1;
```

We add one tile extra on each side because if the current position is close to an edge on the tile the offset can be so large that without an extra tile we would render empty space.

5,6: Moving around and zooming in/out is done simply by modifying the lon/lat and zoom properties of the map object and then rendering the map again. The current code allows only a really simple way to move around: clicking the arrow buttons moves the center point by one tile’s length.

Aside from mathematical problems let’s take a look at the code that renders the map.

```
import { lon2tile, lat2tile, tileOffset, nTiles, createElement } from "./utils.js";
export default class Picomap {
  constructor(height = 500, width = 500, lon = 24.4391, lat = 60.5, zoom = 10, id="map", source="https://tile.openstreetmap.org") {
    this.height = height;
    this.width = width;
    this.lat = lat;
    this.lon = lon;
    this.zoom = zoom;
    this.source = source
    this.map = document.getElementById(id);
    this.map.style = `height: ${this.height}px; width: ${this.width}px; overflow: hidden; transform: translate3d(0px,0px,0px)`;
  }
  #createButton(text, x,y,z, left, top){
    let button = createElement("button");
    button.innerText = text;
    button.style = `width: 20px; position: absolute; top: ${top}px; left: ${left}px`;
    button.addEventListener("click", () => this.#move(x,y,z));
    return button
  }
  #createControlLayer() {
    let controlLayer = createElement("div");
    controlLayer.style = "height: 100%; width: 100%; position: absolute; top: 0px; left: 0px";
    controlLayer.append(this.#createButton("\u25B2", 0, 1, 0, 40, 20)); //Up
    controlLayer.append(createElement("br"));
    controlLayer.append(this.#createButton("\u25C0", -1, 0, 0, 20, 40)); //Left
    controlLayer.append(this.#createButton("\u25B6", 1, 0, 0, 60, 40)); //Right
    controlLayer.append(createElement("br"));
    controlLayer.append(this.#createButton("\u25BC", 0, -1, 0, 40, 60)); //Down
    controlLayer.append(createElement("br"));
    controlLayer.append(this.#createButton("+", 0, 0, 1, 40, 100));
    controlLayer.append(createElement("br"));
    controlLayer.append(this.#createButton("-", 0, 0, -1, 40, 120));
    this.map.append(controlLayer);
  }
  #createTile(x, y, z, transX, transY) {
    const tile = createElement("img");
    tile.src = `${this.source}/${x}/${y}/${z}.png`;
    tile.alt = "";
    tile.style = `width: 256px; height: 256px; opacity: 1; transform: translate3d(${transX}px, ${transY}px, 0px); display: block; position: absolute`;
    return tile;
  }
  #renderTiles() {
    let centerX = lon2tile(this.lon, this.zoom);
    let centerY = lat2tile(this.lat, this.zoom);
    let offset = tileOffset(this.zoom, this.lon, this.lat);
    this.mapLayer.style.transform = `translate3d(${128 - offset.x}px,${128 - offset.y}px,0px)`;
    const tiles = [];
    for (let i = -nTiles(this.height); i <= nTiles(this.height); i++) {
        for (let j = -nTiles(this.width); j <= nTiles(this.width); j++) {
          console.log(i,j)
          let transY = (this.height / 2 - 128) + i * 256;
          let transX = (this.width / 2 - 128) + j * 256;
          tiles.push(this.#createTile(this.zoom, centerX + j, centerY + i, transX, transY));
        }
    }
    this.mapLayer.replaceChildren(...tiles);
  }
  #createMapLayer() {
    this.mapLayer = createElement("div");
    this.mapLayer.style = "height: 100%; width: 100%";
    this.#renderTiles();
    this.map.append(this.mapLayer);
  }
  #move(x,y,z){
    this.lon += x*360/(Math.pow(2,this.zoom));
    this.lat += y*170.12/(Math.pow(2,this.zoom));
    this.zoom += z;
    this.#renderTiles();
  }
  initialize() {
    this.#createMapLayer();
    this.#createControlLayer();
  }
}
```

This is almost all the code for the map client, only the helper functions for calculating the positions have been omitted. We have a class, Picomap, which accepts the following attributes, none of which are required: height, width, lat, lon, zoom, id. The initialize method creates a DOM tree according to the structure described above. The buttons for moving and zooming are initialized with the move onclick method.

Here is a minimal example how to use the map:

Index.html:

```
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/picomap/dist/picomap.js"></script>
    <script src="./index.js"></script>
  </body>
</html>
```

Index.js:

```
const mapInstance = new Picomap();
mapInstance.initialize();
```

And here is the end result:

![captionless image](https://miro.medium.com/v2/resize:fit:1200/format:webp/1*uD_41ZGD5yvQ9hwOvbk0Jg.gif)

The source code can be seen in [my github repo](https://github.com/leoalho/picomap). In total we have used <100 lines of JS without any outside dpendencies.

I highly recommend everybody to do these kind of projects them selves. It is a good way to uphold ones basic JS skills and it makes one appreciate all the functionality that comes with the libraries we use. What is your opinion with the end result? Would you have ended with the same design choices as I did?

Also here are some ideas to play with if you want to fork the project and experiment:

*   Add animation to moving and zooming
*   Add drag to move
*   Make it possible to rotate the map
