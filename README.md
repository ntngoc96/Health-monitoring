# NienLuan2019-HKII

# AppPython Side
## Run

### Install dependencies

`cd AppPython`

`pip install -r requirements.txt`

Turn on your Bluetooth

Unpair you MiBand2 from current mobile apps

Find out your MiBand3 MAC address

```sudo hcitool lescan```

Run this to auth device

```python3 example.py --mac F4:62:E8:D1:DB:82 --init```

If you having problems(BLE can glitch sometimes)

```sudo hciconfig hci0 reset```

### If you have trouble installing bluepy

```sudo apt-get install libglib2-dev  ```

Move to root folder
`cd ..`
# Server Side

`cd ServerExpress`

## Install dependencies

`npm install`

Run server (port 3000)

`npm start`
