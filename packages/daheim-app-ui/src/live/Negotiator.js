/* eslint-env browser */

import 'webrtc-adapter'

const debug = require('debug')('dhm:live:Negotiator')

const CONNECT_TIMEOUT = 30000

export default class Negotiator {

  static RELAY_TYPES = {offer: 1, answer: 1, ice: 1, error: 1}

  constructor ({negotiationId, relay, getIceServers}) {
    this.relay = relay
    this.getIceServers = getIceServers
    this.negotiationId = negotiationId
  }

  start ({initiator}) {
    if (this.promise) return this.promise
    this.promise = this.negotiate({initiator})
    return this.promise
  }

  handleRelay (data) {
    const {type, negotiationId} = data
    if (negotiationId !== this.negotiationId) {
      throw new Error('invalidNegotiationId')
    }

    if (type === 'offer') {
      this.handleOffer(data.sdp)
    } else if (type === 'answer') {
      this.handleAnswer(data.sdp)
    } else if (type === 'ice') {
      if (!data.candidate) return
      this.ice(data.candidate)
    } else if (type === 'error') {
      this.handleError(data)
    } else {
      throw new Error('not handled relay type')
    }
  }

  handleError (err) {
    this.onError(err)
    this.close()
  }

  setProgress (progress) {
    this.progress = progress
    if (this.onProgress) this.onProgress()
  }

  async relayNoThrow (...args) {
    try {
      await this.relay(...args)
    } catch (err) {
      // ignore
    }
  }

  handleTimeoutError () {
    debug('timeout')
    const err = new Error('negotiation timeout')
    this.relayNoThrow({type: 'error', negotiationId: this.negotiationId, message: err.message || err})
    this.handleError(err)
  }

  async negotiate ({initiator}) {
    const {negotiationId, relay, relayNoThrow} = this
    const timeout = this.timeout = setTimeout(() => this.handleTimeoutError(), CONNECT_TIMEOUT)

    try {
      const offerPromise = new Promise((resolve) => { this.handleOffer = (offer) => resolve(offer) })
      const answerPromise = new Promise((resolve) => { this.handleAnswer = (answer) => resolve(answer) })

      const iceBox = []
      this.ice = (candidate) => iceBox.push(candidate)

      //
      // this is the first point of return
      //

      const iceServers = await this.getIceServers()
      if (this.closed) throw this.freeResourcesAndThrow()

      debug('ice servers', iceServers)
      const pc = this.pc = new window.RTCPeerConnection(iceServers)

      // get media stream
      const localStream = this.localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
      if (this.closed) throw this.freeResourcesAndThrow()
      if (this.onProgress) this.onProgress()

      // initialize RTCPeerConnection
      const remoteStreamPromise = new Promise((resolve) => { pc.onaddstream = (e) => resolve(e.stream) })
      pc.onicecandidate = (e) => this.relayNoThrow({type: 'ice', negotiationId, candidate: e.candidate})
      pc.addStream(localStream)
      const connectedPromise = new Promise((resolve) => {
        pc.oniceconnectionstatechange = (e) => {
          const ice = e.target.iceConnectionState
          debug('[%s] ICE: %s', this.negotiationId, ice)
          if (ice === 'failed' || ice === 'disconnected') {
            this.onError(new Error('ice disconnected'))
          } else if (ice === 'connected' || ice === 'completed') {
            resolve(true)
          }
        }
      })

      debug('[%s] starting dance. initiator: %s', this.negotiationId, initiator)
      // do the dance
      if (initiator) {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        await relay({type: 'offer', negotiationId, sdp: offer.sdp})

        const answerSdp = await answerPromise
        try {
          const answer = new RTCSessionDescription({sdp: answerSdp, type: 'answer'})
          pc.setRemoteDescription(answer)
        } catch (err) {
          console.error('cannot set remote description answer', answerSdp, err)
        }
      } else {
        const offerSdp = await offerPromise
        try {
          const offer = new RTCSessionDescription({sdp: offerSdp, type: 'offer'})
          await pc.setRemoteDescription(offer)
        } catch (err) {
          console.error('cannot set remote description offer', offerSdp, err)
        }

        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        await relay({type: 'answer', negotiationId, sdp: answer.sdp})
      }
      debug('[%s] finished negotiation', this.negotiationId)

      // change ice function to real one and replay cached candidates
      this.ice = (candidate) => pc.addIceCandidate(new RTCIceCandidate(candidate))
      for (let candidate of iceBox) this.ice(candidate)

      // wait for remote stream
      this.remoteStream = await remoteStreamPromise
      if (this.closed) this.freeResourcesAndThrow()
      if (this.onProgress) this.onProgress()
      debug('[%s] got remote stream', this.negotiationId)

      // wait for ICE connected
      this.connected = await connectedPromise
      if (this.closed) this.freeResourcesAndThrow()
      if (this.onProgress) this.onProgress()
      debug('[%s] connected', this.negotiationId)

      clearTimeout(timeout)

      return pc
    } catch (err) {
      relayNoThrow({type: 'error', negotiationId, message: err.message || err})
      this.handleError(err)
      throw err
    }
  }

  freeResourcesAndThrow () {
    this.close()
    throw new Error('negotiator closed')
  }

  close () {
    this.closed = true

    if (this.localStream) {
      for (let track of this.localStream.getTracks()) track.stop()
    }

    if (this.timeout) clearTimeout(this.timeout)

    if (this.pc && this.pc.signalingState !== 'closed') this.pc.close()
  }

}
