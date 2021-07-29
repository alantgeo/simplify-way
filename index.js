/* The following code was ported to JavaScript from the original JOSM source at
 * [`josm/src/org/openstreetmap/josm/actions/SimplifyWayAction.java` method `buildSimplifiedNodeList`](https://github.com/openstreetmap/josm/blob/44d2d664b303ebdb11f7cf96e06ccc0d938b17ab/src/org/openstreetmap/josm/actions/SimplifyWayAction.java#L403)
 *
 * The original source code is GPL v2 or later licensed.
 */

/**
 * Returns a simplified LineString
 *
 * @param {Array} coordinates the LineString coordinates to simplify
 * @param {Number} threshold the max error threshold in meters
 * @param {Number} [from] the lower index
 * @param {Number} [to] the upper index
 * @param {Array} [currentSimplification] Array working state of the simplification
 *
 * @returns Array Simplified LineString
 */
function buildSimplifiedLineString(coordinates, threshold, from, to, simplifiedCoordinates) {
  if (from === undefined || from === null) {
    from = 0
  }
  if (to === undefined || to === null) {
    to = coordinates.length - 1
  }

  const fromN = coordinates[from]
  const toN = coordinates[to]

  simplifiedCoordinates = simplifiedCoordinates || []

  // Get max xte
  let imax = -1;
  let xtemax = 0;
  for (let i = from + 1; i < to; i++) {
    const n = coordinates[i]

    const xte = Math.abs(6378137
      * xtd(fromN[1] * Math.PI / 180, fromN[0] * Math.PI / 180, toN[1] * Math.PI / 180,
        toN[0] * Math.PI / 180, n[1] * Math.PI / 180, n[0] * Math.PI / 180))

    if (xte > xtemax) {
      xtemax = xte
      imax = i
    }
  }

  if (imax != -1 && xtemax >= threshold) {
    // Segment cannot be simplified - try shorter segments
    simplifiedCoordinates = buildSimplifiedLineString(coordinates, threshold, from, imax, simplifiedCoordinates)
    simplifiedCoordinates = buildSimplifiedLineString(coordinates, threshold, imax, to, simplifiedCoordinates)
  } else {
    // Simplify segment
    if (simplifiedCoordinates.length === 0 || simplifiedCoordinates[simplifiedCoordinates.length - 1] !== fromN) {
      simplifiedCoordinates.push(fromN)
    }
    if (fromN != toN) {
      simplifiedCoordinates.push(toN)
    }
  }
  return simplifiedCoordinates
}

/* From Aviaton Formulary v1.3
 * http://williams.best.vwh.net/avform.htm
 */
function dist(lat1, lon1, lat2, lon2) {
  return 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
}

function course(lat1, lon1, lat2, lon2) {
  return Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
    * Math.cos(lat2) * Math.cos(lon1 - lon2))
    % (2 * Math.PI)
}

function xtd(lat1, lon1, lat2, lon2, lat3, lon3) {
  const distAD = dist(lat1, lon1, lat3, lon3)
  const crsAD = course(lat1, lon1, lat3, lon3)
  const crsAB = course(lat1, lon1, lat2, lon2)
  return Math.asin(Math.sin(distAD) * Math.sin(crsAD - crsAB))
}

module.exports = buildSimplifiedLineString
