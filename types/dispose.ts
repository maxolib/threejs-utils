import events from 'events'
export default abstract class Dispose {
	emitter: events.EventEmitter = new events.EventEmitter
	dispose() {
		this.emitter.emit("dispose")
	}
	onDispose(action: (...args: any[]) => void) {
		this.emitter.on("dispose", action)
	}
}