/**
 * Detects if two polygons are colliding.
 *
 * Using GJK algorithm.
 * @param {Polygon} polygon0 polygon
 * @param {Polygon} polygon1 polygon
 * @returns {boolean} true if the polygons are colliding, false otherwise
 */
function Is2PolygonsColliding(polygon0, polygon1) {}

/**
 * Support function for GJK algorithm.
 * @param {Polygon} polygon
 * @param {number[]} direction
 * @returns {number[][]} [[most plus position], dot product]
 */
function _GetSupportPoint(polygon, direction) {
	let maxDot = -Infinity
	let maxPos = null

	let edges = polygon.ComputeEdges()

	//find the most plus position
	for (let cnt = 0; cnt < edges.length; cnt++) {
		let edge = edges[cnt]
		let dot = DotVec(edge, direction)
		if (dot > maxDot) {
			maxDot = dot
			maxPos = edge
		}
	}

	return [maxPos, maxDot]
}
