#include <Arduino.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <SocketIoClient.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;
// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

StaticJsonBuffer<200> jsonBuffer;
byte heart[8] = {       // Mảng byte hình trái tim
  0b00000,
  0b01010,
  0b11111,
  0b11111,
  0b11111,
  0b01110,
  0b00100,
  0b00000
}; 
int i;

void displayHeartRate(const char * payload, size_t length) {
  for(i = 11; i <= 13; i++){
    lcd.setCursor(i,0);
    lcd.print(" ");
  }
  lcd.setCursor(11,0);         //Đưa con trỏ về cột thứ 2, hàng 0.
  lcd.print(payload);
  lcd.setCursor(15,0);
  lcd.write(byte(0));
  lcd.blink();                    // Nhấp nháy con trỏ ở vị trí cuối cùng
  USE_SERIAL.printf("got message: %s\n", payload);
}

void setup() {
    USE_SERIAL.begin(115200);
    Wire.begin(2, 0);           //Bắt đầu 2 chân SDA và SCK của I2C
    lcd.init();                 //Bắt đầu màn hình
    lcd.backlight();            // Bật đèn nền
    lcd.home();                 //Đưa con trỏ về vị trí 0,0
    lcd.print("Init connection!!!");
    lcd.blink();
    lcd.display();              // Hiển thị lên màn hình.
    lcd.clear();
    lcd.setCursor(0,0);         //Đưa con trỏ về cột thứ 15, dòng 0.
    lcd.print("heart-rate:");         //Mình sẽ in ra cái mảng hình trái tim nhé

    
    USE_SERIAL.setDebugOutput(true);
  
    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }

    WiFiMulti.addAP("Free_Day Ngoai", "1hai3bon5sau");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    webSocket.on("heart_rate", displayHeartRate);
    webSocket.begin("192.168.1.22",8080);
    // use HTTP Basic Authorization this is optional remove if not needed
    //webSocket.setAuthorization("username", "password");
}

void loop() {
    webSocket.loop();
}
