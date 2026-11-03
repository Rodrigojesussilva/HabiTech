import { io, type Socket } from "socket.io-client"

export function createRealtimeClient(serverUrl: string): Socket {
  return io(serverUrl, { autoConnect: false })
}
