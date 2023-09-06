"""
從RO幻想廳讀取Boss和MVP資料存到monsters.csv
Updated: 2023/09/05
"""
from time import sleep
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd

def decodeEmail(e):
  de = ""
  k = int(e[:2], 16)

  for i in range(2, len(e)-1, 2):
    de += chr(int(e[i:i+2], 16)^k)

  return de

"""
================= load monster list ==================
"""
url_attr = {"boss": {"v": 2, "pages": 14}, "mvp": {"v": 3, "pages": 13}}
url_template = "https://rd.fharr.com/moblist?v={}&g=1&page={}"

#load monster list
monsters = pd.DataFrame()
for tp in url_attr :
  print("Load {}...".format(tp))
  pages = url_attr[tp]["pages"]

  for page in range(1, pages + 1) :
    print("page {}".format(page))
    url = url_template.format(url_attr[tp]["v"], page)
    data = pd.read_html(requests.get(url).text)[0]

    #刪除有數值為空的魔物
    ##data = data.dropna()
    #刪除無傷害數值的魔物
    ##data = data[data["ATK(max)"]>0]
    #刪除測試用魔物和蛋!
    data = data.rename(columns=lambda x: x.replace("↑",""))
    data = data[data["名稱"].str.contains(r"測試|Lv")==False]

    monsters = pd.concat([monsters, data], ignore_index=True)
    sleep(1)

#手動新增未歸類的MVP
monsters.loc[len(monsters)] = [20843, "[M] 深海魔女", 205, "惡魔", "暗3", "大", "75,746,433", 0, 0, 0, 0, "452 + 0", "81 + 81", 405, 375]

print("Catch {} monsters".format(len(monsters)))

"""
================= load monster image and respawn data ==================
"""
url_template = "https://rd.fharr.com/mob-{}.html"
imgData = pd.DataFrame()
respawnData = pd.DataFrame()
for row in monsters.itertuples(index=False) :
  print("Fatch {}'s image and respawn data".format(row.ID))
  url = url_template.format(row.ID)
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
    for parent in location.parents :
      if parent.name == "table" :
        #decode protected email
        encodeEmails = parent.find_all(attrs={"data-cfemail": re.compile(".*")})
        for email in encodeEmails :
          cfemail = email.get("data-cfemail")
          parent.find(attrs={"data-cfemail": cfemail}).replace_with(decodeEmail(cfemail))
          
        data = pd.read_html(str(parent))[0]

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

#重設index為ID
monsters = monsters.set_index("ID")
imgData = imgData.set_index("id")
respawnData = respawnData.set_index("id")

#combine to monsters
monsters = monsters.join(imgData)
monsters = monsters.join(respawnData)

print("Total {} lines, write to file monsters.csv".format(len(monsters)))
monsters.to_csv("monsters.csv", index_label="ID")