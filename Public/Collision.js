//For detecting collision

/**
 * Detects if two polygons are colliding.
 *
 * Using GJK algorithm.
 * @param {Polygon} polygon0 polygon
 * @param {Polygon} polygon1 polygon
 * @param {number} maxIteration maximum number of iterations
 * @returns {boolean} true if the polygons are colliding, false otherwise
 */
function Is2PolygonsColliding(polygon0, polygon1, iterationMax = 500) {
	//initial directions
	let directions = [
		[0, 1],
		[0.5, -0.866],
		[-0.5, -0.866],
	]

	//initial edgess
	let tips = [
		_ComputeMinkowskiTip(polygon0, polygon1, directions[0]),
		_ComputeMinkowskiTip(polygon0, polygon1, directions[1]),
		_ComputeMinkowskiTip(polygon0, polygon1, directions[2]),
	]

	//origin
	const origin = [0, 0]

	//if initial directions shows not including O...
	if (
		DotVec(tips[0], directions[0]) < 0 ||
		DotVec(tips[1], directions[1]) < 0 ||
		DotVec(tips[2], directions[2]) < 0
	) {
		//...then the polygons are not colliding
		return false
	}

	for (let iteration = 0; iteration < iterationMax; iteration++) {
		//if the origin is in the triangle...
		if (_IsOriginInTriangle(tips)) {
			//...then the polygons are colliding
			return true
		}

		//find farthest point in the direction of the origin
		let indexFarthest = -1
		let distanceFarthest = -Infinity
		for (let cnt = 0; cnt < directions.length; cnt++) {
			let dinstance = GetDistance(tips[cnt], origin)
			if (dinstance > distanceFarthest) {
				distanceFarthest = dinstance
				indexFarthest = cnt
			}
		}

		//points left
		const tipsLeft = [
			tips[(indexFarthest - 1 + 3) % 3],
			tips[(indexFarthest + 1) % 3],
		]

		//connected vector
		const connected = SubVec(tipsLeft[1], tipsLeft[0])

		//select direction towards origin
		if (CrossVec(connected, SubVec(origin, tipsLeft[0]) > 0)) {
			directions[indexFarthest] = Rotate2DVector(connected, 90)
		} else {
			directions[indexFarthest] = Rotate2DVector(connected, -90)
		}

		//compute new tip
		tips[indexFarthest] = _ComputeMinkowskiTip(polygon0, polygon1, newDirection)

		//if the new direction shows not including O...
		if (DotVec(tips[indexFarthest], directions[indexFarthest]) < 0) {
			//...then the polygons are not colliding
			return false
		}
	}

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

	let tips = polygon.ComputeEdges()

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

	return SubVec(support0[0], support1[0])
}

/**
 * Origin in triangle
 * @param {number[][]} points [p0, p1, p2]
 * @returns {boolean}
 */
function _IsOriginInTriangle(points) {
	const p01 = SubVec(points[1], points[0])
	const p12 = SubVec(points[2], points[1])
	const p20 = SubVec(points[0], points[2])

	const origin = [0, 0]

	const c01 = CrossVec(p01, SubVec(origin, points[0]))
	const c12 = CrossVec(p12, SubVec(origin, points[1]))
	const c20 = CrossVec(p20, SubVec(origin, points[2]))

	return (
		//every node
		(c01 > 0 && c12 > 0 && c20 > 0) ||
		(c01 < 0 && c12 < 0 && c20 < 0) ||
		Approximate(c01 * c12 * c20, 0)
	)
}
