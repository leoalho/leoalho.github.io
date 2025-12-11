---
title: A minimalist raster tile server with express and postGIS — part 3. Speeding things up
date: "2023-08-31"
slug: minimalist-raster-server-3
tags: gis
---

A minimalist raster tile server with express and postGIS — part 3. Speeding things up
=====================================================================================
So far we have created a minimal map tile server that renders it tiles with postGIS. Our tiles have slowly gotten some features on it.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QPSn2CAkAGi0eGLsDuj95Q.png)

Before any optimization the mean times for rendering the maps above have been 1.1, 2.4 and 5.4 seconds per tile.

Adding Spatial indexes
----------------------

Let us begin with indexing. For my map I have been working with two tables. Simplified_land_polygons downloaded from [osm data](https://osmdata.openstreetmap.de/data/land-polygons.html) and planet_osm_line which includes [Finland’s data from the whole planet-osm dataset.](https://download.geofabrik.de/europe/finland.html) Spatial indexing works in a similar manner to any other index in databases. However, only some of postGIS functions use spatial indexes, in our project it is only ST_intersects that uses spatial indexing. Spatial indexes index the bounding boxes of geometries. When running functions that can use spatial indexes, the database first evaluates the bounding boxes and after that all of the geometries that have their bounding boxes fulfil the functions. The bounding boxes are saved in a data structure called the [R-tree](https://en.wikipedia.org/wiki/R-tree), which is a balanced search tree. Contrary to B-trees, instead of comparing sizes we compare we compare which bounding boxes are inside of each other.

A small example how spatial indexing works.
-------------------------------------------

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ArPs4gM29t1CRjsi4o_pEg.png)

In the figure above we have four geometries: a line, a triangle, a rhombus, and a polygon. In the second image we create a spatial index for the geometries. In the third we call the function ST_intersects to find all the geometries that intersect with the polygon. Now instead of evaluating all of the geometries straight away it first evaluates the bounding boxes.

Adding the indexes
------------------

I added the indexes directly via psql with the `CREATE INDEX {index_name} ON {table_name} USING GIST ({column name});` After that I ran the `ANALYZE {table_name};` command to be sure that postgreSQL's statistics system is up to date. Indexing the land polygon table did not have any meaningful effect on the rendering time but indexing the planet_osm_line table did reduce the mean rendering time from 5.4 seconds to 4.3 seconds. This has most likely to do with the table sizes: land polygons has 63 539 rows and planet_osm_line has 2 835 593 rows. This is of course still an unacceptably high number, but it is already a -19% reduction. Note that I am running the server on my laptop, so the processor is not the best possible.

Adding a cache
--------------

It should be at this time obvious that rendering each tile for every request is computationally way too intensive. Let us then add a cache. I am going to use a rather simple setup by using Redis. Redis saves all its data in memory so it can serve values quickly. I set up a Redis docker container with port bindings to port 6379 (the default port used by Redis). Because the data works in memory, I do not want the cache to become too large, so I created a redis.conf file, with the following configuration.

```
maxmemory 200mb
maxmemory-policy allkeys-lru
```

The memory-policy tells redis how to act when the maxmemory is reached. I used the lru (least recently used) policy. So, in other words when the cache is full, redis will remove the least recently used tile from the cache. Note! As explained in Redis’ [documentation](https://redis.io/docs/reference/eviction/), Redis does not actually know which key is the least recently used, instead it uses an approximation, so the truly least recently used key does not necessarily get removed. In our case this does not have any meaningfull impact on the workings of our server. We can now start the dockerfile with the command `$ docker run -v /myredis/conf:/usr/local/etc/redis --name rediscache redis redis-server /usr/local/etc/redis/redis.conf`. By default Redis saves snapshots of the dataset on disk, so our cache persists even if we need to restart or pause the container.

We now have the following middleware function:

```
app.get("/tiles/:z/:x/:y", async function (req, res) {
  const { z, x, y } = req.params;
  if (pathMakesSense(parseInt(z), parseInt(x), parseInt(y))) {
    try {
      redisValue = await redis_client.get(`${z}_${x}_${y}`);
      if (redisValue) {
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": Buffer.from(redisValue, "hex").length,
        });
        res.end(Buffer.from(redisValue, "hex"));
      } else {
        let response = await pg_client.query(query, [z, x, y]);
        let img = response.rows[0].st_aspng;
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": img.length,
        });
        res.end(img);
        redis_client.set(`${z}_${x}_${y}`, img.toString("hex"));
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.writeHead(400);
    res.end("Incorrect path");
  }
});
```

We first extract variables z, x, y from the req.params object. We then check that the path is valid with the pathMakesSense helper function:

```
const pathMakesSense = (z, x, y) => {
  const maxCoord = 2 ** z;
  return z >= 0 && z <= 20 && x >= 0 && x < maxCoord && y >= 0 && y < maxCoord;
};
```

We then check if the tile is saved in the Redis cache. If so, we serve it directly from the cache. Redis saves it values as strings, so we have to form a buffer from the string before sending it via our response. If the tile is not in our cache, the server renders the tile like before.

Prerendered tiles
-----------------

In addition to a dynamic cache I also wante to have prerendered tiles. Let’s do some simple calculations to see how many tiles we want to prerender. Like stated in the first part, each zoom level z contains z^4 tiles. If we want to render all tiles from 0 to n, we would need (1–4^(n+1))/-3​ tiles. Our png images have three bands, each with a 8 bit (one byte) value. So for a 256*256 pixel png, the maximum size (without taking the headers and magic number into account) would be 256⋅256⋅3 = 196.6 kB. Fortunately png uses lossless compression, and the ST_aspng function is able to compress the pngs. Since our tiles are really simple without many features, a compressed png of our tiles is not anywhere close to 196 kB. I estimated that 5 kB/tile is more realistic. We can now generate the following table.

![captionless image](https://miro.medium.com/v2/resize:fit:876/format:webp/1*EWb0u5E0Lm1dgdW4i4RmMw.png)

From the table above we can easily evaluate up to which zoom level we want to create our prerendered tile cache. I choose up to level 6, because in addition to data size requirements we also have o take into account the computational requirements. It takes for my laptop around 4s to render each tiles, so it took around 4 hours to render the tiles up to level 6. I implemented the prerendered cache with Redis aswell. I wanted the prerendered cache and the dynamic cahce to be clearly their own separate systems, so I started a new Redis container running on a different port (the port is arbitrary, I chose 6380). I added an own file for prerendering the tiles ([.src/prerenderer.js](https://github.com/leoalho/tileserver/blob/main/src/prerenderer.js)), which can be run with the command `npm run prerender {n}`, where n is the zoom level up to which we want to render our tiles. In the main server we add the following clause to our middleware function.

Conclusion
----------

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*p2nesMLX5DEFtjVaXPvKBQ.gif)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IIKff4QoDLdzaRB375bPHQ.gif)

We now have a tile server that renders .png tiles directly with postGIS. We have created two caches, one dynamic and one prerendered. Let’s see how it performs. The first gif is a reminder of the situation before we started optimizing our speed and the second image is the current situation.

The code for this part can be found in [this github repository](https://github.com/leoalho/tileserver) under the ‘main’ branch.
This is probably the last part of this series.
Thank you for reading, comments, critique and suggestions are welcome as always.
