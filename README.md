# simplify-way

Simplify a LineString using JOSM's SimplifyWay algorithm.

## API

```js
const simplify = require('simplify-way')

const coordinates = [
  [151.297447, -33.799392],
  [151.297506, -33.799359],
  [151.297571, -33.799330],
  [151.297611, -33.799341],
  [151.297681, -33.799356],
  [151.297729, -33.799390]
]
const tolerance = 5 // tolerance in meters

const simplifiedCoordinates = simplify(coordinates, tolerance)
```
