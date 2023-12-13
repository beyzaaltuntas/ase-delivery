import RPi.GPIO as GPIO

class LightSensor:
    def __init__(self):
        if GPIO.getmode() is None:
            raise RuntimeError("GPIO mode not set")
        GPIO.setup(7,GPIO.IN,pull_up_down=GPIO.PUD_UP)
    def brightness(self):
        return GPIO.input(7)
    def test(self):
        from time import sleep 
        while(True):
            print(GPIO.input(7))
            sleep(1)
           
