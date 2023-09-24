"""
從RO幻想聽讀取的img url可能因動態載入是空的,
對照monsters.csv重新抓一次存到retry.csv
Updated: 2023/09/24
"""
from time import sleep
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import requests
import re

def decodeEmail(e) :
  de = ""
  k = int(e[:2], 16)

  for i in range(2, len(e)-1, 2) :
    de += chr(int(e[i:i+2], 16)^k)

  return de

"""
================= load monster list ==================
"""
monsters = pd.read_csv("monsters.csv", encoding="utf-8")
monsters = monsters[monsters["img"].isna()]
monsters = monsters.drop(columns=["img", "location", "mapCode", "floor", "time"])
print("{} Catch {} monsters".format(datetime.datetime.now(), len(monsters)))

"""
================= load monster image and respawn data ==================
"""
imgData = pd.DataFrame()
respawnData = pd.DataFrame()
for row in monsters.itertuples(index=False) :
  print("Fatch {}'s image and respawn data".format(row.ID))
  url = "https://rd.fharr.com/db/monster/{}".format(row.ID)
  data = requests.get(url).text
  soup = BeautifulSoup(data, "html.parser")

  #get image url
  imgUrl = ""
  images = soup.select("img.img-radius")
  if len(images) > 0 :
    imgUrl = images[0].get("src")
    tmpData = pd.DataFrame({"id": [row.ID], "img": [imgUrl]})
    imgData = pd.concat([imgData, tmpData], ignore_index=True)

  #get respawn data
  location = soup.find(string=lambda text: text=="重生時間")
  if location :
    table = location.find_parent("table")

    #decode protected email
    encodeEmails = table.find_all(attrs={"data-cfemail": re.compile(".*")})
    for email in encodeEmails :
      cfemail = email.get("data-cfemail")
      table.find(attrs={"data-cfemail": cfemail}).replace_with(decodeEmail(cfemail))
      
    data = pd.read_html(str(table))[0]

    #remove tfoot
    data = data[data["重生時間"].str.contains(r"重生時間")==False]

    #analyze location
    map = data["地圖"].str.extract(r"(?P<location>.*)\((?P<mapCode>.*)\)")
    data = pd.concat([map, data], axis=1)
    data = data.filter(items=["location", "mapCode", "階層", "重生時間"], axis=1)
    data.columns = ["location", "mapCode", "floor", "time"]
    
    #add id column
    data = data.assign(id=row.ID)
    respawnData = pd.concat([respawnData, data], ignore_index=True)
    break
  sleep(1)

"""
==================== combine data and write to file ===================
"""
print("Catch {} image url".format(len(imgData)))
print("Catch {} respawn data".format(len(respawnData)))

#重設index
monsters = monsters.set_index("ID")

if len(imgData) > 0 :
    imgData = imgData.set_index("id")

if len(respawnData) > 0 :
    respawnData = respawnData.set_index("id")

#combine to monsters
monsters = monsters.join(imgData)
monsters = monsters.join(respawnData)

print("{} Total {} lines, write to file retry.csv".format(datetime.datetime.now(), len(monsters)))
monsters.to_csv("retry.csv", index_label="ID")