#!/bin/bash     
topojson -o all.topojson --simplify-proportion 0.3 --no-quantization -p notes,title,distance,total_ascent all.geojson