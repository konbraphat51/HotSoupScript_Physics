//For detecting collision

/**
 * Detects if two polygons are colliding.
 *
 * Using GJK algorithm.
 * @param {Polygon} polygon0 polygon
 * @param {Polygon} polygon1 polygon
 * @param {number} maxIteration maximum number of iterations
 * @returns {boolean} true if the polygons are colliding, false otherwise.
 * If exceeds the maximum number of iterations, undefined.
 */
function Is2PolygonsColliding(polygon0, polygon1, iterationMax = 5000) {
	//initial directions
	const directions = [
		[1, 0],
		[-1, 0],
	]

	//initial edgess
	const tips = [
		_ComputeMinkowskiTip(polygon0, polygon1, directions[0]),
		_ComputeMinkowskiTip(polygon0, polygon1, directions[1]),
	]

	//origin
	const origin = [0, 0]

	//set searcher direction angle
	let searcherAngleL = -Math.PI + 0.001
	let searcherAngleR = Math.PI

	//if initial directions shows not including O...
	if (
		DotVec(tips[0], directions[0]) < 0 ||
		DotVec(tips[1], directions[1]) < 0
	) {
		//...then the polygons are not colliding
		return false
	}

	//bisearch the invalid direction
	for (let iteration = 0; iteration < iterationMax; iteration++) {
		//try the middle angle
		const searcherAngle = (searcherAngleL + searcherAngleR) / 2
		const searcherDirection = [Math.cos(searcherAngle), Math.sin(searcherAngle)]
		const searcherTip = _ComputeMinkowskiTip(
			polygon0,
			polygon1,
			searcherDirection,
		)

		//if the searcherAngle shows not including O...
		if (DotVec(searcherTip, searcherDirection) < 0) {
			//...then polygons are not colliding
			return false
		}

		//if the origin is in the triangle...
		if (_IsOriginInTriangle([tips[0], tips[1], searcherTip])) {
			//...then the polygons are colliding
			return true
		}

		//computing next angle
		const t0st = MinusVec(searcherTip, tips[0])
		const t0o = MinusVec(origin, tips[0])
		//if triangle is left than O...
		if (CrossVec(t0st, t0o) < 0) {
			//...then searcherAngleL is searcherAngle
			searcherAngleL = searcherAngle
		} else {
			//...then searcherAngleR is searcherAngle
			searcherAngleR = searcherAngle
		}
		console.log(searcherAngle)
	}

	console.log(
		"Exceeds the maximum number of iterations.",
		(searcherAngleL + searcherAngleR) / 2,
	)
	alert("a")
	return undefined
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

	let tips = polygon.ComputeVertices()

	//find the most plus position
	for (let cnt = 0; cnt < tips.length; cnt++) {
		let tip = tips[cnt]
		let dot = DotVec(tip, direction)
		if (dot > maxDot) {
			maxDot = dot
			maxPos = tip
		}
	}

	return maxPos
}

/**
 * Compute the tip for the directoin vector  of Minkowski difference of two polygons.
 * @param {Polygon} polygon0
 * @param {Polygon} polygon1
 * @param {number[]} direction vector
 * @returns {number[]} edge vector
 */
function _ComputeMinkowskiTip(polygon0, polygon1, direction) {
	let support0 = _ComputeSupportPoint(polygon0, direction)
	let support1 = _ComputeSupportPoint(polygon1, MultiplyVec(-1, direction))

	return MinusVec(support0, support1)
}

/**
 * Origin in triangle
 * @param {number[][]} points [p0, p1, p2]
 * @returns {boolean}
 */
function _IsOriginInTriangle(points) {
	const p01 = MinusVec(points[1], points[0])
	const p12 = MinusVec(points[2], points[1])
	const p20 = MinusVec(points[0], points[2])

	const origin = [0, 0]
	const c01 = CrossVec(p01, MinusVec(origin, points[0]))
	const c12 = CrossVec(p12, MinusVec(origin, points[1]))
	const c20 = CrossVec(p20, MinusVec(origin, points[2]))

	return (
		(c01 > 0 && c12 > 0 && c20 > 0) || (c01 < 0 && c12 < 0 && c20 < 0)
	)
}
