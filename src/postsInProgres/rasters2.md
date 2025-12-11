A minimalist raster tile server with express and postGIS — part 2. Adding more features
=======================================================================================

For the previous part see [here](https://dev.to/leoalho/a-minimalist-raster-tile-server-with-express-and-postgis-79i). The code for this part can be seen in [the project’s github repository](https://github.com/leoalho/tileserver/tree/features) under branch “features”.

A quick recap: The goal of this project is to create a tile server and use postGIS to render the tiles. In the last part we managed to get a simple tile server with only around 60 lines of Javascript. The map was quite grim, so let us now add some more features to the map.

The data that we used for our first version only contained grey land polygons. Let’s now create a nicer look for adding different colours for the landmass, water and let’s add a coastline as well. The code for the backend remains the same, only the sql query looks different:

```
WITH rasters AS (
    SELECT ST_AsRaster(ST_collect(Array(SELECT ST_TileEnvelope($1,$2,$3))), 256, 256, ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[179, 208, 255], ARRAY[0,0,0]) AS rast
    UNION ALL
    SELECT ST_AsRaster(
      ST_collect(Array(
          SELECT ST_Intersection(geom,ST_TileEnvelope($1,$2,$3)) FROM ${TABLE} UNION
          SELECT ST_boundary(ST_TileEnvelope($1,$2,$3))
      )
    ), 256, 256, ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[251, 255, 194], ARRAY[0,0,0]) AS rast
    UNION ALL
    SELECT ST_AsRaster(
        ST_collect(Array(
            SELECT ST_boundary(ST_Intersection(geom,ST_TileEnvelope($1,$2,$3))) FROM ${TABLE} UNION
            SELECT ST_boundary(ST_TileEnvelope($1,$2,$3))
        )
    ), 256, 256, ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[1,1,1], ARRAY[0,0,0]) AS rast
)
SELECT ST_AsPNG(ST_UNION(rast)) FROM rasters;
```

The query is quite straightforward. We first create three separate rasters. As mentioned in the last post the [ST_asRaster](https://postgis.net/docs/en/RT_ST_AsRaster.html) function accepts many different parameter configurations. Here I have used the synopsis that accepts the following parameters: `(geometry geom, integer width, integer height, text[] pixeltype, double precision[] value=ARRAY[1], double precision[] nodataval=ARRAY[0], double precision upperleftx=NULL, double precision upperlefty=NULL, double precision skewx=0, double precision skewy=0, boolean touched=false)`. The colour is set with the value parameter in [Red, Green, Blue] format.

In our query the first raster contains the water areas and is displayed in blue. Or to be precise, it actually contains the whole tile as a rectangle but when stacked with the land polygon it leaves the water areas blue. The second raster is the raster generated in the last part, it renders the land polygons, this time in a yellowish colour. The third raster displays the coastlines in black, the query for the third raster is rather similar to the second but we have one extra function, ST_boundary, which returns the boundaries of the geometry as a polyline.

The three rasters are then combined with the postGIS function [ST_Union](https://postgis.net/docs/en/RT_ST_Union.html). ST_Union takes an set of rasters (or geometries) and returns a single raster. There are several protocols for handling intersecting areas (LAST (default), FIRST, MIN, MAX, COUNT, SUM, MEAN, RANGE). The default value LAST is the best for our case.

The tiles now have the following look:

![captionless image](https://miro.medium.com/v2/resize:fit:512/format:webp/1*1pz3GDu2fK3vacVgeJA4cQ.png)

Overall, the map looks much nicer than before. There is still the problem (or feature) that the map displays the borders of the tiles as shown below.
I am into sailing and especially marine cartography if it was not yet obvious from the colour scheme used. Perhaps that is the reason as well that the tile borders do not bother me that much.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QlDk74ZSVnXVKOZLZmbeJQ.png)

The reason for the tile borders to be displayed is twofold. Firstly in our last example we only had one raster, if we remove the `SELECT ST_boundary(ST_TileEnvelope($1,$2,$3))` part of our query, postgres gives us errors at some tiles and some tiles are skewed. The skewed tiles are tiles that do not contain land polygon geometries on the border of each side of the tile. By adding the boundary of the envelope we effectively prevent this but then the boundary gets rendered as well.
Secondly in a similar vein in today's example when using ST_Union you have to have the exact alignment with each raster for the function to work.
I have not come up with a good way to get around this, perhaps one way could be using another way of calling the ST_asRaster. If someone else has a suggestion, I am more than happy to learn, I am at no means an expert postGIS user.

We could expand this as much as we want by adding more raster layers. Our initial dataset of simplified land polygons does not provide much more to render, but if we download for example the osm basemap, only the sky is the limit. For example, here I have added the main roads by adding the following raster to our query.

```
SELECT ST_AsRaster(
    ST_collect(Array(
        SELECT ST_Intersection(ST_collect(Array(SELECT way FROM ${TABLE2} WHERE highway IN ('motorway', 'trunk', 'primary'))),ST_TileEnvelope($1,$2,$3))  UNION
        SELECT ST_boundary(ST_TileEnvelope($1,$2,$3))
    )
), 256, 256, ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[1,1,1], ARRAY[0,0,0]) AS rast
```

The query is again straightforward, TABLE2 is the name of the newly created table, in my case “planet_osm_line”. OSM tables have a lot of different columns, and at least to me it is not always intuitive which ones are most relevant, here QGIS or any other GIS software is a good companion for quick visualizing. Also the [OSM wiki](https://wiki.openstreetmap.org/wiki/Key:highway) is a great companion. Now the map has the following look.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9VgfHC3bv0jhoFbVNyGX6A.png)

We probably should add some conditions for what kind of roads we should render on what zoom level, if you look on Google maps or OSM the roads are only visible on certain zoom levels, but this could be the topic of a future article.

The main problem is again speed, at this moment it is even worse than before. Again, postGIS is not meant for rendering raster tiles on the go, so I do not blame it for it. But still, with the current configuration, it takes around 2.3 seconds per tile and around 4 seconds per tile with the roads added. In the last part, with the monotone tiles, it took around 1 second to render a tile.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*p2nesMLX5DEFtjVaXPvKBQ.gif)

Speeding up our server will be the topic of our next part. Thank you again for reading. Any comments are more than welcome.

_Originally published at_ [_https://dev.to_](https://dev.to/leoalho/a-minimalist-raster-tile-server-with-express-and-postgis-part-2-adding-more-features-2d0c) _on August 29, 2023._
