AT+HTTPINIT
AT+HTTPPARA="CID",1
AT+HTTPPARA="URL","www.httpbin.org/anything"
AT+HTTPPARA ="REDIR",1
AT+HTTPSSL=0
AT+HTTPACTION=0
AT+HTTPREAD
AT+HTTPTERM

AT+CIPSHUT
AT+CGATT=1
AT+SAPBR=3,1,"CONTYPE","GPRS"
AT+SAPBR=3,1,"APN","internet"
AT+CSTT="internet"
AT+SAPBR=1,1
AT+CIICR
AT+SAPBR=2,1

"support-driver.herokuapp.com/warning?status=3&location=notready&IDdevice=810&id_event=0&devicePass=notready"
