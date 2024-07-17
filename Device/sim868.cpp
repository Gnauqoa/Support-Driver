#include <Arduino.h>

extern "C" {
#include "sim868.h"
}
#include "string.h"
String simString = "";                 // a String to hold incoming data
char saveSimString[150];

volatile bool simRecComplete = false;  // whether the string is complete
GPS_Data gpsData;
/*
  simReceived occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/



// Create json from gpsData
String createJson(void)
{
  char buffer[61] = "";
  sprintf(buffer, "{\"time\":\"%s\",\"lat\":%s,\"long\":%s}", gpsData.DateTime.c_str(), gpsData.Latitude.c_str(), gpsData.Longitude.c_str());
  DEBUG.println("createJson: ");
  DEBUG.println(buffer);
  return buffer;
}

/* SIM868 FUNCTIONS */
void simReceived() {
  while (SIM_SERIAL.available()) {
    char inChar = (char)SIM_SERIAL.read();
    simString += inChar;
    if (inChar == '\n') simRecComplete = true;
  }
}
bool wait4Response(int timeout) {
  unsigned long timer = millis();
  while (!simRecComplete) {
    if (millis() - timer >= timeout){ return false;}
    simReceived();
  }
  simRecComplete = false;
  return true;
}

bool sendCommand(char *cmd, char* expect = "OK", int timeout = 1000) {
  unsigned long timer = millis();
  SIM_SERIAL.println(cmd);
  DEBUG.print("send to sim: ");
  DEBUG.println(cmd);
  strcpy(saveSimString,"");
  simString = "";
  DEBUG.print("sim response: ");
  while (1) {
    if(millis() - timer >= timeout){ 
      DEBUG.println("timeout");
      return false;
    }
    if (wait4Response(100)) {
      
      if (simString.indexOf(expect) != -1) {        
        strcat(saveSimString,simString.c_str());
        simString = "";
        DEBUG.println(saveSimString);
        return true;
      }
      strcat(saveSimString,simString.c_str());
      DEBUG.print(saveSimString);
      simString = "";
    } 
  }
}

void khoiTaoModule() {
  sendCommand("ATE0", "OK");
  sendCommand("AT+CMGD=1,4", "OK");     //Xóa tất cả tin nhắn rác
  sendCommand("AT+CMGF=1", "OK");       //Cấu hình tin nhắn dạng chữ
  sendCommand("AT+CNMI=2,2", "");
  /** Set up APN for GPRS */
  khoitaoGPRS();
  /* GPS Command */
  sendCommand("AT+CGNSPWR=1", "OK");  //Bật tín hiệu GPS (AT+CGNSPWR=0 là tắt tín hiệu GPS)
  sendCommand("AT+CGNSTST=0", "OK");  //Tat gui tin hieu GPS qua cong Serial2 cua Sim868)

}

/******************* PUBLIC FUNCTIONS ****************************/
void CauHinhIO() {
  DEBUG.begin(115200);
  SIM_SERIAL.begin(115200);
  pinMode(LED_EMG, OUTPUT);
  pinMode(LED_GSM, OUTPUT);
  pinMode(COI_BAO, OUTPUT);
  pinMode(KHOA_XE, OUTPUT);

  pinMode(NUT_KHANCAP, INPUT);

  pinMode(SIM_PWR, OUTPUT);
  pinMode(SIM_RIA, INPUT);
  pinMode(SIM_DTR, OUTPUT);

  LED_EMG_ON;
  LED_GSM_ON;
  TAT_COI_BAO;
  MO_KHOA_XE;
  delay(1000);

  // reserve 300 bytes for the inputString:
  simString.reserve(200);
}

bool SIM_PowerOn() {
  if (sendCommand("AT", "OK")) {
    khoiTaoModule();
    DEBUG.println("SIM Ready!");
    return true;
  } else {
    DEBUG.println("SIM Power On...");
    SIM_PWR_ON;
    delay(3000);
    SIM_PWR_OFF;
    delay(5000);
    if (sendCommand("AT", "OK")) {
      DEBUG.println("SIM Power Turned On.");
      khoiTaoModule();
      DEBUG.println("SIM Ready!");
      return true;
    }
  }
  return false;
}

void goiDienThoai(char *sdt) {
  int answer = false;
  char buffer[30] = "";
  sprintf(buffer, "ATD%s;", sdt);
  do {
    answer = sendCommand(buffer, "OK", 1000);
  } while (answer == false);  //Chờ đến khi gọi thành công (lệnh như vòng lập)
  DEBUG.println("Called " + String(sdt) + "!");
}

void guiTinNhan(char *sdt, const String noidung) {
  char buffSMS[200];
  bool answer = true;
  uint16_t timeout = 1000;
    delay(1000);
  SIM_SERIAL.readString();
  SIM_SERIAL.readString();
  DEBUG.print("SMS Sending..");
  sprintf(buffSMS, "AT+CMGS=\"%s\"", sdt);  // gán cụm sau vào trước ,
  sendCommand(buffSMS, "", 200);
  while (!SIM_SERIAL.available()) {
    if (--timeout == 0)
    {
      answer = false;
      break;
    }
  }
  if (answer) {
    DEBUG.print(SIM_SERIAL.readString());
    SIM_SERIAL.print(gpsData.DateTime);
    SIM_SERIAL.println(noidung);
    SIM_SERIAL.print("http://maps.google.com/maps?q=loc:");
    SIM_SERIAL.print(gpsData.Latitude);
    SIM_SERIAL.print(",");
    SIM_SERIAL.print(gpsData.Longitude);
    delay(10);
    SIM_SERIAL.write(26);    // Ctrl + Z
    DEBUG.println("Sent SMS to " + String(sdt) + "!");
  }
}

extern char soKhanCap1[]; //Số điện thoại để gọi và nhắn tin khi khẩn cấp
extern char soKhanCap2[];
extern char soNguoiLai[];

void xuLyTinNhanDen(String sms) {
  char* command = strtok((char*)sms.c_str(), " ");
  String sdt = strtok(0, ",");
  strtok(0, ",");
  strtok(0, "\n");
  String noidung = strtok(0, "\n");
  sdt = sdt.substring(4, sdt.length() - 1);
  char buffSMS[12];
  sprintf(buffSMS, "0%s", sdt.c_str());
  sdt = buffSMS;

  DEBUG.print(sdt);
  DEBUG.print(": ");
  DEBUG.println(noidung);
  /* Kiem tra so dien thoai co phai cua chu ko */
  if ((sdt.indexOf(soKhanCap1) >= 0) ||
      (sdt.indexOf(soKhanCap1) >= 0) ||
      (sdt.indexOf(soKhanCap1) >= 0))
  {
    docThongTinGPS();
    if (noidung.indexOf("Vitri") >= 0) guiTinNhan((char*)sdt.c_str(), noidung);
    else if (noidung.indexOf("Baodong") >= 0) 
    {
      /* Bao dong va gui tin nhan phan hoi */
      BAT_COI_BAO;
      guiTinNhan((char*)sdt.c_str(), noidung);
    }
    else if (noidung.indexOf("Tatmay") >= 0)
    {
      /* Tat may va gui tin nhan phan hoi */
      TAT_KHOA_XE;
      guiTinNhan((char*)sdt.c_str(), noidung);
    }
    else guiTinNhan((char*)sdt.c_str(), noidung); // Gui tin Huong dan
  }
}
bool getRequest(char *url,char * output){
  unsigned long timeout = millis();
  char cmd[150] = "";
  bool requestStatus = 0;
  sprintf(cmd, "AT+HTTPPARA=\"URL\",\"%s\"",url);
  sendCommand("AT+HTTPTERM", "OK");                    //Terminate current http
  sendCommand("AT+HTTPINIT", "OK");                    //Init HTTP
  sendCommand("AT+HTTPPARA=\"CID\",1", "OK");          //Set http parameter “CID”:Bearer profile identifier
  sendCommand(cmd,"OK");  
  sendCommand("AT+HTTPPARA =\"REDIR\",1","OK");
  sendCommand("AT+HTTPSSL=0","OK");                               
  sendCommand("AT+HTTPACTION=0","OK");                 //Start send Request
  while (1) {
    if (wait4Response(1000)) break;
    if(millis() - timeout >= 10000) break;
  }
  while (1) {
    if (wait4Response(1000)) break;
    if(millis() - timeout >= 10000) break;
  }
  DEBUG.println("Status connect: ");
  DEBUG.println(simString);
  DEBUG.println(simString.indexOf("200"));
  if(simString.indexOf("200") == -1){ 
    DEBUG.println("Request failed, try again");
    DEBUG.println("reset GPRS");
    khoitaoGPRS(); // restart GPRS
    DEBUG.println("try again");

    return 0;
  }

  sendCommand("AT+HTTPREAD","OK",1000);//Start Read server return data
  strncpy(output,strchr(saveSimString,'{'),strrchr(saveSimString,'}')-strchr(saveSimString,'{')+1);
  return 1;
}
//String postRequest(String url,String json){
//  unsigned long timeout = millis();
//  json = "{}";
//  Serial.print("length: ");
//  Serial.println(json.length());
//  sendCommand("AT+HTTPTERM","OK");                                                   //Terminate current http
//  sendCommand("AT+HTTPINIT", "OK");                                             //Init HTTP
//  sendCommand("AT+HTTPPARA=\"CID\",1", "OK");                                   //Set http parameter “CID”:Bearer profile identifier
//  sendCommand("AT+HTTPPARA=\"URL\",\"support-driver.herokuapp.com/register\"", "OK"); //Set connect to your URL
//  sendCommand("AT+HTTPPARA=\"CONTENT\",\"application/json\"", "OK");
//  //sendCommand("AT+HTTPDATA=" + String(json.length()) + ",10000", "DOWNLOAD");
//  //sendCommand(json);
//  sendCommand("AT+HTTPACTION=1", "OK");    
//
//  SIM_SERIAL.println("AT+HTTPREAD ");
//  while (1) {
//    if (wait4Response(1000)) {
//        DEBUG.print("Server Response Data: ");
//        DEBUG.println(simString);
//        break;
//    }
//    if(millis() - timeout > 10000) break;
//  }
//  
//}
void khoitaoGPRS() {
  sendCommand("AT+CIPSHUT", "OK");
  sendCommand("AT+CGATT=1", "OK");
  sendCommand("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"", "OK");
  sendCommand("AT+SAPBR=3,1,\"APN\",\"internet\"", "OK");
  sendCommand("AT+CSTT=\"internet\"", "OK");
  sendCommand("AT+SAPBR=1,1", "OK");  //Enable the GPRS
  sendCommand("AT+CIICR", "OK");
  sendCommand("AT+SAPBR=2,1","OK");
}
bool docThongTinGPS() {
  int timeout = 2000;
  bool ret = false;
  SIM_SERIAL.println("AT+CGNSINF");
  while (1) {
    if (wait4Response(1000)) {
      DEBUG.println("reading...");
      if (simString.indexOf("+CGNSINF:") >= 0) {
        char* command = strtok((char*)simString.c_str(), " ");// cắt chuỗi do GPS gửi về
        strtok(0, ",");
        
        String a = strtok(0, ",");
        
     
     
        if (a.equals("1"))
        {
          // Co tin hieu GPS!
      
          char* time = strtok(0, ",");
          gpsData.Latitude = strtok(0, ",");
          gpsData.Longitude = strtok(0, ",");
          gpsData.DateTime = strtok(time, ".");
          gpsData.DateTime = gpsData.DateTime.substring(8);
         
          // Print json gps data for debug
          DEBUG.println(createJson());
          ret = true;
          DEBUG.println(gpsData.Latitude);
          break;
        }
        break;
      }
    }
    if (--timeout == 0){ 
      DEBUG.println("timeout");
      break;
    }
  }
  simString = "";
  return ret;
}
