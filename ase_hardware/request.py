import json
import requests
import string
from requests import Response

class Request:
    def __init__(self):
        with open("config.json") as configjson:
            config=json.load(configjson)
            self.raspberryPi_ID=config["ID"]
            self.api_url=config["URL"]
    def checkID(self,id):
        temp=self.api_url+"api/delivery-service/raspberry/"+self.raspberryPi_ID+"/rfid/"+id
        response=requests.patch(url=temp)
        print(response)
        if response.status_code == 200:
            return True
        else:
            return False
    def close(self):
        temp=self.api_url+"api/delivery-service/raspberry/"+self.raspberryPi_ID+"/closed-verification"
        response=requests.patch(url=temp)
        print(response)