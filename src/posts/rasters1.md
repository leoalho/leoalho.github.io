# A minimalist raster tile server with express and postGIS

If one starts to read about rendering maps, it is easy to get lost in the plethora of different technologies involved. I have read about several blogposts on how to implement a vector tile server solely with postGIS but not many how to implement a raster tile server.

The objective of this project is to create an as minimalist as possible raster tileserver. It is not going to be flashy nor is it going to be quick, but my ethos in learning new skills and technologies is to try to make an implementation of the new skill as independently and simply as possible. This adds alot of appreciation to the available solutions and it also helps to understand what problems each of the technologies involved try to solve.

The code for the project can be found in [this github repository](https://github.com/leoalho/tileserver), the code for this post is under branch “simple”.

Let us start with some basic definitions so we are on the same page. A tileserver is a server which serves tiles that form a map. Tiles commonly follow the z,x,y naming standard, where z is zoom level, and x and y are coordinates on that zoom level. Zoom level 0 contains the entire globe on one tile and each subsequent zoom level contains double the amount of tiles on the x and y axes, so each zoom level it has z⁴ tiles (z² \* z²).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c0f9pifpr5git5agtcjs.png)

There are two types of tiles: raster and vector tiles, which are rather self explanatory. In this project I will create a raster tile server. In a map application each raster tile has the same resolution, a common resolution is 256x256 pixels. The normal standard for fetching tiles is servername/x/y/z.png.

Usually when creating a tile server one needs the following building blocks:

1. The data
2. A way to render the maps
3. A server that handles the requests and responses

To create a tile server we are going to need data. I will be using Openstreetmaps (OSM) data and the postgresql extension postGIS for storing the tiles.

I used data from https://osmdata.openstreetmap.de/data/land-polygons.html to download the data. OSM data is downloaded as OSM data (.osm) or as shapefiles (.shp). Shapefiles and OSM data can be opened with most GIS-software, I personally use QGIS. The polygons used for this project is in .shp.

For the shapefile to be readable with postgres, we need to change the format of the data. I use shp2psql which is a really straightforward cli program, shp2psql is included in the postGIS bundle when downloading postGIS. For converting osm data, [osm2psql](https://osm2pgsql.org/) can be used.

In this example I will not use a separate rendered, but instead I will render the tiles directly with postGIS.

The core problem is to now generate a sql query to render a png tile in position z,x,y. Luckily the postGIS extension contains many functions that makes this possible. I have used the following query in my project:

```
SELECT ST_AsPNG(
  ST_AsRaster(
      ST_collect(Array(
          SELECT ST_Intersection(geom,ST_TileEnvelope($1,$2,$3)) FROM ${TABLE} UNION
          SELECT ST_boundary(ST_TileEnvelope($1,$2,$3))
      )
  ), 256, 256, ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[100,100,100], ARRAY[0,0,0])
);
```

Let's go through the query. For those not so familiar with postGIS, the functions beginning with ST are postGIS functions. THe query assumes that all the geometries to be rendered are in a column calles geom.

Moving from the inside out we have

- ST_Intersection(geometry A, geometry B) return a portion of geometry A and geometry B that is shared between the two geometries.
- ST_TileEnvelope(z,x,y): Creates a rectangular Polygon giving the extent of a tile in the xyz system.
- ST_collect(geometry[]) Collects geometries into a geometry collection
- ST_AsRaster() Converts a PostGIS geometry to a PostGIS raster
- ST_AsPNG() Returns the selected bands of the raster as a single png

For further info about postGIS functions, please see the excellent [postGIS documentation](https://postgis.net/docs/en/). Especially for the AsRaster and AsPNG functions, since there are several possibilities for the arguments, so for simplicity’s sake I did not list them here

The backend is rather straightforward. I will be using Express for the http server and the pg library for the postgresql API.

Here is the code of the backend in its entirety, as you can see, it is really compact:

```
require("dotenv").config();
const { Client } = require("pg");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
const PUBLICPATH = path.join(__dirname, "./public");
const PGUSERNAME = process.env.PGUSERNAME;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const TABLE = process.env.TABLE;

const query = `
SELECT ST_AsPNG(
  ST_AsRaster(
      ST_collect(Array(
          SELECT ST_Intersection(geom,ST_TileEnvelope($1,$2,$3)) FROM ${TABLE} UNION
          SELECT ST_boundary(ST_TileEnvelope($1,$2,$3))
      )
  ), 256, 256, ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[100,100,100], ARRAY[0,0,0])
);
`;

const pathMakesSense = (z, x, y) => {
  const maxCoord = 2 ** z;
  return z >= 0 && z <= 20 && x >= 0 && x < maxCoord && y >= 0 && y < maxCoord;
}

const client = new Client({
  user: PGUSERNAME,
  database: DATABASE,
  password: PASSWORD,
});

client.connect();

let app = express();

app.get("/tiles/:z/:x/:y", async function (req, res) {
  const { z, x, y } = req.params;
  if (pathMakesSense(parseInt(z), parseInt(x), parseInt(y))) {
    try {
        let response = await client.query(query, [z, x, y]);
        img = response.rows[0].st_aspng;
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": img.length,
        });
        res.end(img);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.writeHead(400);
    res.end("Incorrect path");
  }
});

app.use(express.static(PUBLICPATH));

app.listen(PORT, HOSTNAME, () => {
  console.log(`Listening on ${HOSTNAME}, port ${PORT}`);
});
```

The rest of the code can be found in the github repository. The frontend map functionality is implemented with leaflet and is also really straightforward.

Let us see how the application works. Below is a real time gif of my laptop rendering the tiles.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6971vjpe3xmzdczp8qap.gif)

Quite frustratingly slow, right? It takes around one second per tile for the server to render each tile. It does have its own militaresque look, but it is quite monotonous without that many features.

he single tiles are served via servername/tiles/z/x/y. So for example http://localhost:8080/tiles/10/582/296 returns the following tile.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3mj3sslfukxephhfparz.png)

Thank you for reading. Any comments are welcome. In the next posts I will first make the maps a bit nicer and then make the map faster by adding a simple cache
