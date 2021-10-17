
export class AudioBufferSourceManager {
    private cache: Record<string, AudioBuffer> = {}

    constructor(readonly context = new AudioContext()) {
    }

    async getAudioBuffer(url: string) {
        if (this.cache[url]) {
            return this.cache[url]
        }

        const result = await fetch(url, { method: 'get' })
        const buffer = await result.arrayBuffer()
        const audioBuffer = await this.context.decodeAudioData(buffer)
        this.cache[url] = audioBuffer
        return audioBuffer
    }

    async createSound(buf: AudioBuffer) {
        const source = this.context.createBufferSource()
        source.loop = true
        source.loopEnd = 1
        source.playbackRate.value = 0.1
        source.buffer = buf
        source.connect(this.context.destination)

        source.onended = function () {
            this.disconnect()
        }

        return source
    }
}