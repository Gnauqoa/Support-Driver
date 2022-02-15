
#include <Wire.h>
#include "MPU6050.h"
#include "Kalman.h"
#include <EEPROM.h>
extern "C" {
  #include "sim868.h"
}

// AT+HTTPINIT
// AT+HTTPPARA="CID",1
// AT+HTTPPARA="URL","www.httpbin.org/anything"
// AT+HTTPPARA="URL","support-driver.herokuapp.com/warning2?IDdevice=81&status=1&location="bentre"&coordinates=10.0071973,105.8662085"
// AT+HTTPPARA ="REDIR",1
// AT+HTTPSSL=0
// AT+HTTPACTION=0ksuaiodsa
// AT+HTTPREAD
// AT+HTTPTERM
#define SAFETY_ANGLEX 100   //Góc nghiên an toàn X
#define SAFETY_ANGLEY 50    //Góc nghiên an toàn Y
#define NGUONG_VA_CHAM 450  //ngưỡng chấn động

#define THOI_GIAN_LON_NHAT 65000
#define TIME_PRESS_MIN 150
#define DEVICE_ID "0AD787F"

char soKhanCap1[] = "0385912050";  //Số điện thoại để gọi và nhắn tin khi khẩn cấp
char soKhanCap2[] = "0385912050";
char soNguoiLai[] = "0385912050";

/*Dữ liệu Cảm biến gia tốc MPU-6050*/
MPU6050 cbGiatoc;
Kalman LocNhieuX;  //Sữ dụng bộ lọc nhiễu tín hiệu cho cảm biến gia tốc
Kalman LocNhieuY;  //Sữ dụng bộ lọc nhiễu tín hiệu cho cảm biến gia tốc

uint16_t timeline = 0;

/* Các cờ báo */
bool khoi_dong = true;
bool xayRaTaiNan = false;
bool baoNutKhanCap = false;


bool sim868_OK = false;

String simResp;  // a String to hold incoming data

bool phatHienTaiNan(void);      //Kiểm tra phát hiện tai nạn
bool xuLyNutNhanKhanCap(void);  //Kiểm tra nhấn nút khẩn cấp


byte statusMotor = 0; // trạng thái xe
int id_event = 0;// mã sự kiện, để giao tiếp vs server


void setup() {
  // put your setup code here, to run once:
 Serial.begin(115200);
 CauHinhIO();
 getEEPROMdata();
 if (!cbGiatoc.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)) {
   Serial.println("MPU6050 Initial Failed!");
 }
 sim868_OK = SIM_PowerOn();
 if (!sim868_OK) LED_GSM_OFF;
 LED_EMG_OFF;

}
void loop() {
 if (timeline % 50 == 0)
 {
   if (sim868_OK) LED_GSM_TOGGLE; //Bao module sim dang hoat dong.
   if (baoNutKhanCap || xayRaTaiNan) LED_EMG_TOGGLE; //Nhay den canh bao khi co tai nan hay nhan nut khan cap
 }
 
 if (khoi_dong && timeline > 60000) khoi_dong = false;

 if (phatHienTaiNan() && (!xayRaTaiNan)) {
   if (!khoi_dong)
   {
     xayRaTaiNan = true;
     BAT_COI_BAO;
     docThongTinGPS();
     guiTinNhan(soKhanCap1, "TAINAN");
   }
 }
 if (xuLyNutNhanKhanCap())
 { 
   if ((!baoNutKhanCap) && (!xayRaTaiNan)) {
     DEBUG.println("* Bao khan cap.");
     baoNutKhanCap = true;
     TAT_KHOA_XE;
     BAT_COI_BAO;
     docThongTinGPS();
     guiTinNhan(soKhanCap1, "KHANCAP");
   }
   else { //Trở lại hoạt động bình thường
     DEBUG.println("* Tro lai hoat dong binh thuong.");
     baoNutKhanCap = false;
     xayRaTaiNan = false;
     TAT_COI_BAO;
     MO_KHOA_XE;
   }
 }

 if(DEBUG.available()){
   String s = DEBUG.readString();
   bool flag = 0;
   if(s.indexOf("quang-0") != -1){
     flag = 1;
     char response[100] = "";
     //char url[] =  "www.httpbin.org/anything";
     char url[] =  "support-driver.herokuapp.com/warning2?IDdevice=81&status=1&location=\"bentre\"&coordinates=10.0071973,105.8662085";
     DEBUG.println("Start Request: ");
     getRequest(url,response);  
     DEBUG.print("Data responseeeeeeeeeeeeeeeeeeeeee: ");
     DEBUG.println(response);
     strtok(strtok(response,","),":");
     id_event = atoi(strtok(0,","));
     EEPROM.write(0,id_event);
   }

   
   if(s.indexOf("quang-2") != -1){
     flag = 1;
     docThongTinGPS();
   }
   if(s.indexOf("quang-1") != -1){
     flag = 1;
     khoitaoGPRS();
   }
   if(flag == 0)
     SIM_SERIAL.println(s);
 }
 if (SIM_SERIAL.available()) {
   while (SIM_SERIAL.available() > 0) {
     DEBUG.write(SIM_SERIAL.read());
   }
 }
 // Timeline loop
 if (++timeline == 65000) timeline = 0;
 delay(10);
}
void getEEPROMdata(){
  id_event = EEPROM.read(0);
  statusMotor = EEPROM.read(1);
}
bool phatHienTaiNan(void) {
  bool coTaiNan = false;
  static double kalAngleX = 0, kalAngleY = 0;  //Giá trị góc đã lọc nhiễu
  static double rollOld = 0, pitchOld = 0;     //Giá trị góc cũ đọc từ cảm biến
  static uint32_t timer = 0;

  Vector RawAccel = cbGiatoc.readRawAccel();
  double accX, accY, accZ;
  accX = RawAccel.XAxis;
  accY = RawAccel.YAxis;
  accZ = RawAccel.ZAxis;
  Vector RawGyro = cbGiatoc.readRawGyro();
  double gyroX, gyroY;
  gyroX = RawGyro.XAxis;
  gyroY = RawGyro.YAxis;
  double dt = (double)(micros() - timer) / 1000000;
  timer = micros();
  double roll = atan2(accY, accZ) * RAD_TO_DEG;
  double pitch = atan(-accX / sqrt(accY * accY + accZ * accZ)) * RAD_TO_DEG;

  if ((roll < -90 && kalAngleX > 90) || (roll > 90 && kalAngleX < -90))  // tạo TH để lọc nhiễu
  {
    LocNhieuX.setAngle(roll);
    kalAngleX = roll;
  } else
    kalAngleX = LocNhieuX.getAngle(roll, (gyroX / 131.0), dt);
  if (abs(kalAngleX) > 90) gyroY = -gyroY;
  kalAngleY = LocNhieuY.getAngle(pitch, (gyroY / 131.0), dt);

  //Doc du lieu ra va in len mang hinh Debug
  /*Serial.print(roll); Serial.print("\t");
  Serial.print(kalAngleX); Serial.print("\t\t");
  Serial.print(pitch); Serial.print("\t");
  Serial.print(kalAngleY); Serial.println("\t");*/

  if (((-SAFETY_ANGLEY > kalAngleY) || (kalAngleY > SAFETY_ANGLEY)) || ((-SAFETY_ANGLEX > kalAngleX) || (kalAngleX > SAFETY_ANGLEX)) || (abs(roll - rollOld) > NGUONG_VA_CHAM) || (abs(pitch - pitchOld) > NGUONG_VA_CHAM)) {
    coTaiNan = true;
  }

  rollOld = roll;
  pitchOld = pitch;
  return coTaiNan;
}

bool xuLyNutNhanKhanCap(void) {
  static bool daNhan = false;
  static uint16_t thoi_diem_nhan = 0;
  bool nut_nhan = DOC_NUT_NHAN ? false : true;
  uint16_t thoi_gian_nhan = 0;

  if (nut_nhan && (!daNhan))  //Bat dau nhan nut
  {
    thoi_diem_nhan = timeline;
    daNhan = true;
  } else if ((!nut_nhan) && daNhan)  //Nha nut nhan
  {
    daNhan = false;
    if (timeline > thoi_diem_nhan) thoi_gian_nhan = timeline - thoi_diem_nhan;
    else
      thoi_gian_nhan = THOI_GIAN_LON_NHAT - thoi_diem_nhan + timeline;
    if (thoi_gian_nhan >= TIME_PRESS_MIN) {
      DEBUG.print("* Thoi gian nhan nut: ");
      DEBUG.println(thoi_gian_nhan);
      return true;
    }
  }
  return false;
}
