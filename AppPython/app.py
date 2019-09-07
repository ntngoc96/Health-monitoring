import socketio
import time
sio = socketio.Client()


@sio.on('connect')
def socket_connected():
    print("Connected")
    print(sio.eio.sid)


@sio.on("message")
def message_received(message):
    print(message)


sio.connect('http://localhost:3000')


while True:
    sio.emit("something", "Hello from python.")
    sio.send("hello")
    time.sleep(3)