function fire(event) {
	if (event.target.classList.length === 1) {
		event.target.classList.add("checked");
		let count = 0;
		const launch = setInterval(() => {
			if (count < 25) {
				render(event);
				count++;
			} else {
				clearTimeout(launch);
			}
		}, 32);
	} else {
		event.target.classList.remove("checked");
	}
};

function render(event) {
	const el = event.target;
	const c = newPiece();
	const s = 1;
	let degs = 0;
	let x = 0;
	let y = 0;
	let opacity = 0;
	let count = 0;
	let xfactor;
	const yfactor = ran(10, 40) * (1 + s / 10);
	if (ran(0, 1) === 1) {
		xfactor = ran(5, 40) * (1 + s / 10);
		c.style.left = "-30px";
	} else {
		xfactor = ran(-5, -40) * (1 + s / 10);
		c.style.left = "30px";
	}
	let start = null;
	el.appendChild(c);

	const animate = (timestamp) => {
		if (!start) {
			start = timestamp;
		}
		const progress = timestamp - start;
		if (progress < 2000) {
			window.requestAnimationFrame(animate);
		} else {
			el.removeChild(c);
		}
		c.style.opacity = opacity;
		c.style.transform = `translate3d(${Math.cos((Math.PI / 36) * x) * xfactor}px, ${
			Math.cos((Math.PI / 18) * y) * yfactor
		}px, 0) rotateZ(${degs}deg) rotateY(${degs}deg)`;
		degs += 15;
		x += 0.5;
		y += 0.5;
		if (count > 25) {
			opacity -= 0.1;
		} else {
			opacity += 0.1;
		}
		count++;
	};

	window.requestAnimationFrame(animate);
};

function newPiece() {
	const n = document.createElement("div");
	n.style.width = "4px";
	n.style.height = "6px";
	n.style.position = "absolute";
	n.style.left = 0;
	n.style.right = 0;
	n.style.margin = "0 auto";
	n.style.opacity = 0;
	n.style.pointerEvents = "none";
	n.style.backgroundColor = colors[ran(0, 4)];
	return n;
};

function ran(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const colors = ["#FF8E70", "#C76DFC", "#4192F6", "#77DDA8", "#F8E71C"];

export default fire;
