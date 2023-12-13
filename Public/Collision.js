/**
 * Detects if two polygons are colliding.
 *
 * Using GJK algorithm.
 * @param {Polygon} polygon0 polygon
 * @param {Polygon} polygon1 polygon
 * @returns {boolean} true if the polygons are colliding, false otherwise
 */
function Is2PolygonsColliding(polygon0, polygon1) {
	//initial vectors
	let vector0 = [1, 0]
	let vector1 = [-1, 0]
	let vector2 = [0, 1]
}

/**
 * Support function for GJK algorithm.
 * @param {Polygon} polygon
 * @param {number[]} direction
 * @returns {number[]} most plus position
 */
function _ComputeSupportPoint(polygon, direction) {
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

	return maxPos
}

/**
 * Compute the Edge for the directoin vector  of Minkowski difference of two polygons.
 * @param {Polygon} polygon0
 * @param {Polygon} polygon1
 * @param {number[]} direction vector
 * @returns {number[]} edge vector
 */
function _ComputeMinkowskiEdge(polygon0, polygon1, direction) {
	let support0 = _ComputeSupportPoint(polygon0, direction)
	let support1 = _ComputeSupportPoint(polygon1, MultiplyVec(-1, direction))

	return SubVec(support0[0], support1[0])
}
