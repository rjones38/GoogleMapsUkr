import requests
from bs4 import BeautifulSoup
import json
import os

def ScrubUKNews():
	URL = "https://liveuamap.com/"
	page = requests.get(URL)
	parser = BeautifulSoup(page.text, "lxml")
	news = parser.find("div", {"class" : "scrotabs"})
	jsonFile = open("tmp/news.json", "w", encoding="ascii")
	descrips = news.findAll('div', attrs={'class':'title'})
	jsonFile.write("[")
	#print(len(rows))
	for i in range(0, len(descrips)):
		descr = descrips.pop().text
		jsonStr = json.dumps(descr)
		jsonFile.write(jsonStr + ",")
		print(descr)
	jsonFile.seek(jsonFile.seek(0, os.SEEK_END) - 1)
	jsonFile.truncate()
	jsonFile.write("]")
	jsonFile.close()
	

ScrubUKNews()