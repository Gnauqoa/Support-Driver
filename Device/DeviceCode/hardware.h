#ifndef __HARDWARE_H__
#define __HARDWARE_H__

#define NUT_KHANCAP         7
#define LED_EMG             8
#define LED_GSM             9
#define COI_BAO             6
#define KHOA_XE             5

#define SIM_PWR             21
#define SIM_RIA             20
#define SIM_DTR             19

#define DEBUG               Serial
#define SIM_SERIAL          Serial1

#define LED_EMG_ON          digitalWrite(LED_EMG, HIGH)
#define LED_EMG_OFF         digitalWrite(LED_EMG, LOW)
#define LED_EMG_TOGGLE      digitalWrite(LED_EMG, !digitalRead(LED_EMG))
#define LED_GSM_ON          digitalWrite(LED_GSM, HIGH)
#define LED_GSM_OFF         digitalWrite(LED_GSM, LOW)
#define LED_GSM_TOGGLE      digitalWrite(LED_GSM, !digitalRead(LED_GSM))

#define SIM_PWR_ON          digitalWrite(SIM_PWR, LOW)
#define SIM_PWR_OFF         digitalWrite(SIM_PWR, HIGH)

#define BAT_COI_BAO         digitalWrite(COI_BAO, HIGH)
#define TAT_COI_BAO         digitalWrite(COI_BAO, LOW)

#define MO_KHOA_XE          digitalWrite(KHOA_XE, LOW)
#define TAT_KHOA_XE         digitalWrite(KHOA_XE, HIGH)

#define DOC_NUT_NHAN        digitalRead(NUT_KHANCAP)

#endif /* __HARDWARE_H__ */
