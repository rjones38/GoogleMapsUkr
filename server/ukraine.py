import requests
from bs4 import BeautifulSoup
import json
import os

class City:
	english = ""
	#russian = ""
	def __init__(self, english, russian):
		self.english = english
		self.russian = russian
	def toJSON(self):
		return json.dumps(self, default=lambda o: o.__dict__)

def ScrubGeography():
	URL = 'https://en.wikipedia.org/wiki/List_of_cities_in_Ukraine'
	page = requests.get(URL)
	parser = BeautifulSoup(page.text, "lxml")
	table = parser.find("table", { "class" : "wikitable sortable" })
	rows = table.findAll(lambda tag: tag.name=='tr')
	index = 0
	jsonFile = open("tmp/ukraine.json", "w")
	jsonFile.write("[")
	for _ in range(0, len(rows)):
		city = rows.pop().text
		nameList = city.split("\n")
		nameEnglish = nameList[1].strip()
		nameRussian = nameList[2].strip()
		#data = {"{english: " + base64.encodestring(nameEnglish), "russian: " + base64.encodestring(nameRussian) + " }" }
		if(nameEnglish != 'City name'):
			print(index, nameEnglish, nameRussian)
			cityNames = City(nameEnglish, nameRussian)
			jsonStr = json.dumps(cityNames.toJSON(), ensure_ascii=False)
			jsonStr = jsonStr.replace('\\', "").replace('"{', "{").replace('}"', "},")
			print(jsonStr)
			jsonFile.write(jsonStr)
		index = index + 1
	jsonFile.seek(jsonFile.seek(0, os.SEEK_END) - 1)
	jsonFile.truncate()
	jsonFile.write("]")
	jsonFile.close()
ScrubGeography()