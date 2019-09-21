# Health Monitoring Realtime with socketio, firestore and Miband 2 

# Installation Python Side
  ## Install dependencies
  ```
    $ cd AppPython

    $ pip install -r requirements.txt
  ```
  - Turn on your Bluetooth

  - Unpair you MiBand from current mobile apps

  - Find out your MiBand MAC address

```
    $ sudo hcitool lescan
```
  - Run this to auth device
```
    $ python3 example.py --mac YOUR-MAC --init
```
  - If you having problems(BLE can glitch sometimes)
```
    $ sudo hciconfig hci0 reset
```

   ### If you have trouble installing bluepy

```
    $ sudo apt-get install libglib2-dev 
```
# Installation Server Side
  ## Install dependencies
```
    $ cd ..
    $ cd ServerExpress
    $ npm install
```

  Run server (port 8080)

```
    $ npm start
```
# Installation Client Side
  ## Install dependencies
```
    $ cd ..
    $ cd client-side
    $ npm i
```
  Run app
```
    $ npm start
```
