"""
從RO幻想廳讀取Boss和MVP資料存到monsters.csv
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

def concat_monster(monsters, res_text) :
  data = pd.read_html(res_text)[0]

  #刪除有數值為空的魔物
  ##data = data.dropna()
  #刪除無傷害數值的魔物
  ##data = data[data["ATK(max)"]>0]
  #刪除測試用魔物和蛋!
  data = data.rename(columns=lambda x: x.replace("↑",""))
  data = data[data["名稱"].str.contains(r"測試|Lv")==False]

  monsters = pd.concat([monsters, data], ignore_index=True)
  return monsters

start_time = datetime.datetime.now()
print("Start crawling monsters from rd.fharr.com at {}".format(start_time))

"""
================= load monster list ==================
"""
moblist_url = "https://rd.fharr.com/moblist"
session = requests.session()
data = session.get(moblist_url).text
soup = BeautifulSoup(data, "html.parser")

category_name = {"boss": "BOSS魔物", "mvp": "MVP魔物"}
monsters = pd.DataFrame()
for name in category_name :
  category = soup.find(string=lambda text: text==category_name[name]).parent
  print("Load {}...from {}".format(name, category.attrs["href"]))

  page = 1
  last_page = 1
  while page <= last_page :
    print("page {}".format(page))
    url = "{}&g=1&page={}".format(category.attrs["href"], page)
    data = session.get(url).text
    monsters = concat_monster(monsters, data)

    if page == 1 :
      soup = BeautifulSoup(data, "html.parser")
      links = soup.find_all(attrs={"class": "page-link"})
      last_page = int(links[len(links) - 1].text) if len(links) > 0 else 1
    
    page += 1
    sleep(1)

#手動新增未歸類的MVP
monsters.loc[len(monsters)] = [20843, "[M] 深海魔女", 205, "惡魔", "暗3", "大", "75,746,433", 0, 0, 0, 0, "452 + 0", "81 + 81", 405, 375]

print("{} Catch {} monsters".format(datetime.datetime.now(), len(monsters)))

"""
================= load monster image and respawn data ==================
"""
imgData = pd.DataFrame()
respawnData = pd.DataFrame()
for row in monsters.itertuples(index=False) :
  print("Fatch {}'s image and respawn data".format(row.ID))
  url = "https://rd.fharr.com/db/monster/{}".format(row.ID)
  
  #動態載入js可能造成img url為空, 等待1秒後重新請求
  reqCount = 1
  stopCount = 3
  while reqCount < stopCount :
    data = session.get(url).text
    soup = BeautifulSoup(data, "html.parser")
    reqCount += 1

    #get image url
    imgUrl = ""
    images = soup.select("img.img-radius")
    if len(images) > 0 :
      imgUrl = images[0].get("src")
      tmpData = pd.DataFrame({"id": [row.ID], "img": [imgUrl]})
      imgData = pd.concat([imgData, tmpData], ignore_index=True)
      reqCount = stopCount
    elif reqCount == 2 :
      print("Can't not get {} img url, try again after 1 second".format(row.ID))
      sleep(1)

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

  sleep(1)

print("Catch {} image url".format(len(imgData)))
print("Catch {} respawn data".format(len(respawnData)))

"""
==================== combine data and write to file ===================
"""

#重設index為ID
monsters = monsters.set_index("ID")
imgData = imgData.set_index("id")
respawnData = respawnData.set_index("id")

#combine to monsters
monsters = monsters.join(imgData)
monsters = monsters.join(respawnData)

print("Total {} lines, write to file monsters.csv".format(len(monsters)))
monsters.to_csv("monsters.csv", index_label="ID")

end_time = datetime.datetime.now()
print("Crawl finished at {}, it takes {} seconds".format(end_time, (end_time - start_time).total_seconds()))