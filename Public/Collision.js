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
 * @see https://dyn4j.org/2010/04/gjk-gilbert-johnson-keerthi/#gjk-create
 */
function Is2PolygonsColliding(polygon0, polygon1, iterationMax = 5000) {
	const initialDirections = [
		[1, 0],
		[-1, 0],
		[0, 1],
	]

	//initial edgess
	let tips = [
		_ComputeMinkowskiTip(polygon0, polygon1, initialDirections[0]),
		_ComputeMinkowskiTip(polygon0, polygon1, initialDirections[1]),
		_ComputeMinkowskiTip(polygon0, polygon1, initialDirections[2]),
	]

	//origin
	const origin = [0, 0]

	//if initial directions shows not including O...
	if (
		DotVec(tips[0], initialDirections[0]) < 0 ||
		DotVec(tips[1], initialDirections[1]) < 0 ||
		DotVec(tips[2], initialDirections[2]) < 0
	) {
		//...then the polygons are not colliding
		return false
	}

	for (let iteration = 0; iteration < iterationMax; iteration++) {
		//find the nearest edge to O
		let nearestEdgeIndex = null //*0*->1, *1*->2, *2*->0
		let nearestEdgeLength = Infinity
		for (let cnt = 0; cnt < 3; cnt++) {
			let tip = tips[cnt]
			let nextTip = tips[(cnt + 1) % 3]
			let edge = MinusVec(nextTip, tip)
			let edgeDistance = GetDistanceFromLine2D(origin, tip, edge)

			if (edgeDistance < nearestEdgeLength) {
				nearestEdgeIndex = cnt
				nearestEdgeLength = edgeDistance
			}
		}
		const nearestEdge = MinusVec(
			tips[(nearestEdgeIndex + 1) % 3],
			tips[nearestEdgeIndex],
		)

		//select the normal vector towards O
		const nearestEdge3D = [nearestEdge[0], nearestEdge[1], 0]
		const toOrigin = MinusVec(origin, tips[nearestEdgeIndex])
		const toOrigin3D = [toOrigin[0], toOrigin[1], 0]
		let normal = CrossVec(CrossVec(nearestEdge3D, toOrigin3D), nearestEdge3D) //3D
		normal = [normal[0], normal[1]] //convert to 2D

		//compute Minkowski the tip for the normal vector
		let newTip = _ComputeMinkowskiTip(polygon0, polygon1, normal)

		//if the new direction shows not including O...
		if (DotVec(newTip, normal) < 0) {
			//...then the polygons are not colliding
			return false
		}

		//swap with the farthest tip
		tips[(nearestEdgeIndex + 2) % 3] = newTip

		//if the origin is in the triangle...
		if (_IsOriginInTriangle(tips)) {
			//...then the polygons are colliding
			return true
		}
	}

	console.log("Exceeds the maximum number of iterations.")
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

	return (c01 > 0 && c12 > 0 && c20 > 0) || (c01 < 0 && c12 < 0 && c20 < 0)
}
