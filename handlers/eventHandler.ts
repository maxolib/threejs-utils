import ThreeHandler from "./threeHandler";

export default interface Events {
	onClick: () => void,
	onHover: () => void,
	onEnter: () => void,
	onLeave: () => void,
	onTouchStart: () => void
	onTouchEnd: () => void
	onTouchMove: () => void
}

export default class EventHandler {
	handler: ThreeHandler

	constructor(handler: ThreeHandler) {
		this.handler = handler
		this.handler.onAwakeTick(() => {
		})
	}
}