"""
解析monsters.csv製作monsters.js
"""
import re
import pandas as pd

def getMSEC(str):
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

def transToMSEC(x):
  tmp = re.search(r'(\d+(天|小時|分鐘))(\d+(天|小時|分鐘))?', str(x))
  msec = getMSEC(tmp[1]) + (getMSEC(tmp[3]) if pd.notna(tmp[3]) else 0)
  return msec
"""
===================================
"""
result = pd.read_csv("monsters.csv", encoding="utf-8")
print("1. result length {}".format(len(result)))

#刪除即時和秒數重生的資料
#result = result[result["time"].notna() & result["time"].str.contains(r"^\d+.?[天|時|分]")]
result = result[result["time"].isna() | (result["time"].str.contains(r"^(即時|\d+秒)")==False)]
print("2. result length {}".format(len(result)))

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
result["location"] = result["location"] + result["floor"].apply(lambda x: " " + x if pd.notna(x) else "")
result["location"] = result["location"].replace(r"( |\[網站備註\])", "", regex=True)
result["location"] = result["location"].replace(r" ", " ", regex=True)

#只取需要的欄位
result = result.filter(items=["ID", "isMVP","名稱","Lv↑","種族","屬性","體型", "img", "location", "msec"], axis=1)

#自訂欄位名稱
result.columns = ["roId", "isMVP", "name", "level", "race", "element", "size", "image", "location", "msec"]

#result.to_json("monsters.json", orient="index", force_ascii=False, indent=2)
result = result.sort_values(by=["isMVP", "roId", "level", "msec", "location"])

#重設index
result = result.reset_index(drop=True)
result.insert(0, "id", result.index.tolist())

jsonData = result.to_json(orient="records", force_ascii=False, indent=2)
with open("../src/constants/monsters.js", "w+", encoding="utf-8") as file:
  file.write(f"export const monsters = {jsonData}")