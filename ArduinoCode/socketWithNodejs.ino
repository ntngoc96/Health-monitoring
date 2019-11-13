#include <Arduino.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <SocketIoClient.h>

#define USE_SERIAL Serial
#define LED_ALERT_NORMAL 4
#define LED_ALERT_WARNING 5
#define LED_ALERT_DANGER 15

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;
// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

StaticJsonDocument<200> jsonBuffer;
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
  DeserializationError error = deserializeJson(jsonBuffer, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  int heart_rate = jsonBuffer["heart_rate"];
  int alert = jsonBuffer["alertLED"];
  Serial.print(heart_rate);
  Serial.print("\n");
  for (i = 11; i <= 13; i++) {
    lcd.setCursor(i, 0);
    lcd.print(" ");
  }
  lcd.setCursor(11, 0);        //Đưa con trỏ về cột thứ 11, hàng 0.
  lcd.print(heart_rate);
  //  switch (alert)
  //{
  //    case 0: // code to be executed if n = 0;
  //        digitalWrite(LED_ALERT_NORMAL,HIGH);
  //        digitalWrite(LED_ALERT_WARNING,LOW);
  //        digitalWrite(LED_ALERT_DANGER,LOW);
  //        break;
  //    case 1: // code to be executed if n = 1;
  //        digitalWrite(LED_ALERT_NORMAL,LOW);
  //        digitalWrite(LED_ALERT_WARNING,HIGH);
  //        digitalWrite(LED_ALERT_DANGER,LOW);
  //        break;
  //    case 2: // code to be executed if n = 2;
  //        digitalWrite(LED_ALERT_NORMAL,LOW);
  //        digitalWrite(LED_ALERT_WARNING,LOW);
  //        digitalWrite(LED_ALERT_DANGER,HIGH);
  //        break;
  //    default: // code to be executed if n doesn't match any cases
  //      break;
  //}

  USE_SERIAL.printf("got message: %s\n", payload);
}

void setup() {
  pinMode(LED_ALERT_NORMAL, OUTPUT);
  pinMode(LED_ALERT_WARNING, OUTPUT);
  pinMode(LED_ALERT_DANGER, OUTPUT);
  USE_SERIAL.begin(115200);
  Wire.begin(2, 0);           //Bắt đầu 2 chân SDA và SCK của I2C
  lcd.init();                 //Bắt đầu màn hình
  lcd.backlight();            // Bật đèn nền
  lcd.clear();
  lcd.home();                 //Đưa con trỏ về vị trí 0,0
  lcd.print("Init connection!!!");
  lcd.blink();
  lcd.display();              // Hiển thị lên màn hình.



  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  WiFiMulti.addAP("iPhone", "hahahaha");
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }
  delay(3000);
  lcd.clear();
  lcd.setCursor(0, 0);        //Đưa con trỏ về cột thứ 15, dòng 0.
  lcd.print("heart-rate:");
  lcd.setCursor(15, 0);
  lcd.write(byte(0));
  lcd.blink();                    // Nhấp nháy con trỏ ở vị trí cuối cùng

  webSocket.on("heart_rate", displayHeartRate);
  webSocket.begin("192.168.0.194", 8080);
  // use HTTP Basic Authorization this is optional remove if not needed
  //webSocket.setAuthorization("username", "password");
}

void loop() {
  webSocket.loop();
}