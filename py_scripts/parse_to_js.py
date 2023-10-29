"""
解析monsters.csv製作monsters.js, monstersPreload.js, images.csv
Updated: 2023/09/24
"""
import re
import pandas as pd

def getMSEC(str) :
  SENCOND = 1000
  MINUTE = SENCOND * 60
  HOUR = MINUTE * 60
  DAY = HOUR * 24

  time = re.search(r"(\d+)(天|小時|分鐘)", str)
  return{
    "天": DAY,
    "小時": HOUR,
    "分鐘": MINUTE
  }.get(time[2], SENCOND) * int(time[1])

def transToMSEC(x) :
  tmp = re.search(r'(\d+(天|小時|分鐘))(\d+(天|小時|分鐘))?', str(x))
  msec = getMSEC(tmp[1]) + (getMSEC(tmp[3]) if pd.notna(tmp[3]) else 0)
  return msec
"""
===================================
"""
result = pd.read_csv("monsters.csv", encoding="utf-8")
print("1. Number of source results: {}".format(len(result)))

#刪除即時和秒數重生的資料
#result = result[result["time"].notna() & result["time"].str.contains(r"^\d+.?[天|時|分]")]
result = result[result["time"].isna() | (result["time"].str.match("(即時|\d+秒)")==False)]
print("2. Number of results after filtering: {}".format(len(result)))

#空白、未知或條件式的重生時間都預設1小時
result["time"] = result["time"].fillna("1小時")
result = result.replace({"time": r"^\D+.*"}, {"time": "1小時"}, regex=True)

#轉換重生時間為milliseconds
result = result.assign(msec=lambda x: x["time"].replace(r"((\d+(天|小時|分鐘))+).*", value=r"\1", regex=True).apply(transToMSEC))

#增加isMVP欄位
result = result.assign(isMVP=result["名稱"].str.count("[M]")==True)

#修改無意義的值
result["名稱"] = result["名稱"].apply(lambda x: x[re.search(r"\[M?B?\]\s", x).end():])
result = result.replace({"img": r"null.gif"}, {"img": pd.NA}, regex=True)
result = result.replace({"floor": r"隨機"}, {"floor": pd.NA}, regex=True)

#修改img url為本地檔名
result["img"] = result.apply(lambda x: str(x["ID"]) + ".png" if pd.notna(x["img"]) else pd.NA, axis=1)

#結合地圖與樓層資訊
#result["location"] = result["location"] + result["floor"].apply(lambda x: " " + x if pd.notna(x) else "")
result["location"] = result["location"].replace(u"(\s|\[網站備註\])", "", regex=True)
result["location"] = result["location"].replace(r"～", "~", regex=True)

#English name填空: shining-moon(en_name) > divine-pride(en_bak_name) > RO官方名(s_name)
result["en_name"] = result["en_name"].fillna(result["en_bak_name"])
result["en_name"] = result["en_name"].fillna(result["s_name"])

#只取需要的欄位
result = result.filter(items=["ID", "isMVP","名稱","en_name","Lv","種族","屬性","體型", "img", "location", "mapCode", "floor", "msec"], axis=1)

#自訂欄位名稱
result.columns = ["roId", "isMVP", "name","en_name", "level", "race", "element", "size", "image", "location", "mapCode", "floor", "msec"]

#新增id為[roId_mapCode]
result.insert(0, "id", result.apply(lambda x: str(x["roId"]) + "_" + (str(x["mapCode"]) if pd.notna(x["mapCode"]) else "na"), axis=1))

#result.to_json("monsters.json", orient="index", force_ascii=False, indent=2)
result = result.sort_values(by=["isMVP", "id", "level", "msec", "mapCode"], ascending=[False, True, True, True, True])

#刪除重複id
result = result.drop_duplicates(subset="id")
print("3. Number of results after drop duplicate id: {}".format(len(result)))

#建立魔物資料
filename = "../src/constants/monsters.js"
jsonData = result.to_json(orient="records", force_ascii=False, indent=2)
with open(filename, "w+", encoding="utf-8") as file:
  file.write(f"export const monsters = {jsonData}")
print(f"Overwrite {filename}")

#建立魔物預載列表
filename = "../src/pwa/monstersPreload.js"

result = result.filter(items=["roId", "image"], axis=1)
result = result.drop_duplicates(subset="image")
result = result[result["image"].notna()]
result.to_csv("images.csv", index=False)
print("4. Number of preload images: {}, save to images.csv".format(len(result)))

result = result.filter(items=["image"], axis=1)
jsonData = result.to_json(orient="records", force_ascii=False, indent=2)
with open(filename, "w+", encoding="utf-8") as file:
  file.write(f"const monsters = {jsonData}")
print(f"Overwrite {filename}")