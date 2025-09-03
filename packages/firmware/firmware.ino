#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include "config.h"

HTTPClient http;
WiFiClient client;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
}

void loop() {
  if (Serial.available()) {
    String cardId = Serial.readStringUntil('\n');
    cardId.trim();

    if (cardId.length() > 0)
      sendCardId(cardId, room_id);
  }
}

void sendCardId(String cardId, String roomId) {
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(client, String(server_url) + "/api/trpc/nfc.scan");
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"id\":1,\"json\":{\"cardId\":\"" + cardId + "\",\"roomId\":\"" + roomId + "\"}}";

    int httpCode = http.POST(payload);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.printf("POST failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected!");
  }
}
