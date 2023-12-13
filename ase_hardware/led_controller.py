import RPi.GPIO as GPIO
from time import sleep

class Led:
    def __init__(self):
        if GPIO.getmode() is None:
            raise RuntimeError("GPIO mode not set")
        GPIO.setup(3,GPIO.OUT,initial=GPIO.LOW)
        GPIO.setup(5,GPIO.OUT,initial=GPIO.LOW)
    def greenOn(self):
        self.ledOff()
        GPIO.output(3,GPIO.HIGH)
    def redOn(self):
        self.ledOff()
        GPIO.output(5,GPIO.HIGH)
    def ledOff(self):
        GPIO.output(3,GPIO.LOW)
        GPIO.output(5,GPIO.LOW)
    def toggleRed(self):
        self.redOn()
        sleep(1)
        self.ledOff()
        sleep(1)
    def toggleGreen(self):
        self.redOn()
        sleep(1)
        self.ledOff()
        sleep(1)

