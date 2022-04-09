import { Source } from "love.audio"
import { getX } from "love.mouse"

const Z_ZOOM = 5

function degreesToRadians(x: number) {
	return x * (Math.PI / 180)
}

class Vector2 {
	x: number
	y: number

	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	rotate(degrees: number): Vector2 {
		const r = degreesToRadians(degrees)
		const s = Math.sin(r), c = Math.cos(r)

		return new Vector2(
			this.x*c-this.y*s,
			this.y*c+this.x*s,
		)
	}

	add(point: Vector2): Vector2 {
		return new Vector2(
			this.x + point.x,
			this.y + point.y,
		)
	}

	subtract(point: Vector2): Vector2 {
		return new Vector2(
			this.x - point.x,
			this.y - point.y,
		)
	}
}

class Vector3 {
	x: number
	y: number
	z: number

	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	add(point: Vector3) {
		return new Vector3(
			this.x + point.x,
			this.y + point.y,
			this.z + point.z,
		)
	}

	subtract(point: Vector3) {
		return new Vector3(
			this.x - point.x,
			this.y - point.y,
			this.z - point.z,
		)
	}

	rotate
}

class Camera {
	position: Vector3
	rotation: Vector3

	constructor() {
		this.position = new Vector3()
		this.rotation = new Vector3()
	}
}

type TriangleTuple = [Vector3, Vector3, Vector3]

function SD(a: number, b: number): number {
	if (b == 0) return 0
	return a / b
}

class Triangle {
	points: TriangleTuple

	constructor(points: TriangleTuple) {
		this.points = points
	}

	moveAndRotate(offset: Vector3, rotation: Vector3): Triangle {
		return new Triangle(this.points.map(p => {
			p = p.subtract(offset)
			const p1 = new Vector2(p.x, p.z).rotate(rotation.x)
			p.x = p1.x
			p.z = p1.y
			const p2  = new Vector2(p.x, p.y).rotate(rotation.y)
			p.x = p2.x
			p.y = p2.y
			const p3  = new Vector2(p.y, p.z).rotate(rotation.z)
			p.y = p3.x
			p.z = p3.y
			p = p.subtract(offset)
			return p
		}) as TriangleTuple)
	}

	draw(camera: Camera, origin?: Vector3, rotation?: Vector3) {
		let temp = new Triangle(this.points)
		if (origin && rotation) {
			temp = temp.moveAndRotate(origin, rotation)
		}
		temp = temp.moveAndRotate(camera.position, camera.rotation)
		for (let i = 0; i < 3; i++) {
			let j = (i + 1) % 3
			love.graphics.print(`x: ${temp.points[i].x}, y: ${temp.points[i].z}`, 0, 20*i)
			love.graphics.line(
				200 + SD(temp.points[i].x, temp.points[i].z / Z_ZOOM),
				120 + SD(temp.points[i].y, temp.points[i].z / Z_ZOOM),
				200 + SD(temp.points[j].x, temp.points[j].z / Z_ZOOM),
				120 + SD(temp.points[j].y, temp.points[j].z / Z_ZOOM),
			)
		}
	}
}

// function drawPrism(camera: Camera, position: Vector3, size: number, sides: number, rotation? :number) {
// 	const sideLength = size /sides
// 	const a = sideLength/(2*Math.tan(Math.PI/sides))

// 	for (let i = sides; i >= 0; i--) {
// 		var r = degreesToRadians(i*(360/sides)+45)
// 		var jx = Math.cos(r)*a+position.x, jy=Math.sin(r)*r+position.y
// 		var px = Math.cos(r+degreesToRadians(360/sd))*a+x
// 		var py = Math.sin(r+degToRad(360/sd))*a+y
// 		DrawTri3D(ctx, x, y, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
// 		DrawTri3D(ctx, px, py, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
// 		DrawTri3D(ctx, jx, jy, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
// 		// why did i do this twice lol
// 		DrawTri3D(ctx, x, y, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
// 	}
// }

let camera = new Camera()

let loadedAudio: Source
let triangles = [
	new Triangle([
		new Vector3(0, 0, 3),
		new Vector3(30, 0, 3),
		new Vector3(0, 30, 3),
	]),
	new Triangle([
		new Vector3(60, 0, 3),
		new Vector3(30, 0, 3),
		new Vector3(60, 30, 3),
	])
]
let animation = new Vector3()

love.load = () => {
}

love.update = (dt) => {
	if (love.keyboard.isDown("w")) {
		camera.position.z -= 0.1
	}
	if (love.keyboard.isDown("s")) {
		camera.position.z += 0.1
	}
	if (love.keyboard.isDown("a")) {
		camera.rotation.x -= 1
	}
	if (love.keyboard.isDown("d")) {
		camera.rotation.x += 1
	}
	// animation.y += 1
	animation.x += 1
}

love.draw = () => {
	triangles.map(
		t => t.draw(camera, new Vector3(), animation)
	)
};
