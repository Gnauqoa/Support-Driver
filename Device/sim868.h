#include "hardware.h"
#include "Arduino.h"

struct GPS_Data{
  String DateTime;
  String Latitude;
  String Longitude;
};

/* Functions Prototype */
void CauHinhIO();
bool SIM_PowerOn();
bool getRequest(char *url,char * output);
String postRequest(String url,String json);
void goiDienThoai(char *sdt);
void guiTinNhan(char *sdt, const String noidung);
void xuLyTinNhanDen(String sms);
void khoitaoGPRS();
bool docThongTinGPS();
