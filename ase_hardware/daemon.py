import RPi .GPIO as GPIO
from mfrc522 import SimpleMFRC522
from led_controller import Led
from time import sleep
from light_sensor import LightSensor
from request import Request
import json
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
led=Led()
request=Request()
ls = LightSensor()
reader = SimpleMFRC522()
while True:
 try:
   id,text = reader.read()
   print(text)
   if request.checkID(str(text)):
       led.greenOn()
       sleep(3)
       led.ledOff()
       sleep(7)
       while(ls.brightness()==0):
           led.toggleRed()
       request.close()
   else:
       led.redOn()
       sleep(3)
       led.ledOff()
 except KeyboardInterrupt:
   led.ledOff()
   GPIO.cleanup()
   raise
