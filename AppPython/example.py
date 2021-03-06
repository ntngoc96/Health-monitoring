import sys
import struct
import socketio
import time
import random
import argparse
from datetime import datetime
from base import MiBand2
from constants import ALERT_TYPES

sio = socketio.Client()

@sio.on('connect')
def socket_connected():
    print("Connected")
    print(sio.eio.sid)


@sio.on("message")
def message_received(message):
    print(message)

sio.connect('http://localhost:8080')

# defining a params dict for the parameters to be sent to the API 
PARAMS = {'steps':0, 'calories':0,'meter':0,'heart_rate': 0} 


parser = argparse.ArgumentParser()
parser.add_argument('-s', '--standard',  action='store_true',help='Shows device information')
parser.add_argument('-r', '--recorded',  action='store_true',help='Shows previews recorded data')
parser.add_argument('-l', '--live',  action='store_true',help='Measures live heart rate')
parser.add_argument('-i', '--init',  action='store_true',help='Initializes the device')
parser.add_argument('-m', '--mac', required=True, help='Mac address of the device')
parser.add_argument('-t', '--set_current_time', action='store_true',help='Set time')
parser.add_argument('-k', '--testapp',  action='store_true',help='Test working of python code')


args = parser.parse_args()

MAC = args.mac # sys.argv[1]

band = MiBand2(MAC, debug=True)
band.setSecurityLevel(level="medium")

if  args.init:
    if band.initialize():
        print("Init OK")
    band.set_heart_monitor_sleep_support(enabled=False)
    band.disconnect()
    sys.exit(0)
else:
    band.authenticate()

if args.recorded:
    print('Print previews recorded data')
    band._auth_previews_data_notif(True)
    start_time = datetime.strptime("12.03.2018 01:01", "%d.%m.%Y %H:%M")
    band.start_get_previews_data(start_time)
    while band.active:
        band.waitForNotifications(0.1)

if args.standard:
    print ('Message notif')
    band.send_alert(ALERT_TYPES.MESSAGE)
    time.sleep(3)
    # this will vibrate till not off
    print ('Phone notif')
    band.send_alert(ALERT_TYPES.PHONE)
    time.sleep(8)
    print ('OFF')
    band.send_alert(ALERT_TYPES.NONE)
    print ('Soft revision:',band.get_revision())
    print ('Hardware revision:',band.get_hrdw_revision())
    print ('Serial:',band.get_serial())
    print ('Battery:', band.get_battery_info())
    print("type of battery_info: ", type(band.get_battery_info()))
    print ('Time:', band.get_current_time())
    print ('Steps:', band.get_steps())
    print ('Heart rate oneshot:', band.get_heart_rate_one_time())
   
if args.set_current_time:
    now = datetime.now()
    print ('Set time to:', now)
    print ('Returned: ', band.set_current_time(now))
    print ('Time:', band.get_current_time())

def l(x):
    print ('Realtime heart:', x)
    sio.emit("heart_rate", { 'heart': x})





def p(x):
    sio.emit("battery", band.get_battery_info()) 

def f(x):
    print ('Raw accel heart:', x)

def s(x):
    print ('Steps: ', x)
    sio.emit('steps',x)
def b(x):
    print ('Raw heart:', x)
if args.live:
    band.start_heart_rate_realtime(
            heart_measure_callback=l,
            steps_count_callback=s,
            battery_info_callback=p)
    



if args.testapp:
    while 1:
        rand = random.randrange(60,130)
        sio.emit("heart_rate", {'heart_rate': rand})
        time.sleep(3)
band.disconnect()







#/* Test without Miband */
# import sys
# import struct
# import socketio
# import time
# import random
# import argparse
# from datetime import datetime
# # from base import MiBand2
# from constants import ALERT_TYPES

# sio = socketio.Client()

# @sio.on('connect')
# def socket_connected():
#     print("Connected")
#     print(sio.eio.sid)


# @sio.on("message")
# def message_received(message):
#     print(message)

# sio.connect('http://localhost:8080')

# parser = argparse.ArgumentParser()
# parser.add_argument('-k', '--testapp',  action='store_true',help='Test working of python code')


# args = parser.parse_args()
# if args.testapp:
#     while 1:
#         rand = random.randrange(60,130)
#         print(rand)
#         sio.emit("heart_rate", {'heart_rate': rand})
#         time.sleep(3)