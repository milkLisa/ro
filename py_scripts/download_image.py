"""
對照images.csv從nn.ai4rei.net下載圖檔,
若失敗則從monsters.csv的img url下載,
並縮小成max 64*64 pixel,
再轉存png格式至public/static/images資料夾
Updated: 2023/09/24
"""
from time import sleep
from bs4 import BeautifulSoup
from PIL import Image
import pandas as pd
import requests
import datetime
import os
import io

def reduce_and_save_image(content, outpath) :
  """
  with open(outpath, "wb") as outfile:
    outfile.write(content)
  """

  ###### 用Pillow處理圖片才存檔 ######
  image = Image.open(io.BytesIO(content))
  imgWidth, imgHeight = image.size
  print("image size: {} {}".format(imgWidth, imgHeight))

  # 等比例縮放
  MAXWIDTH, MAXHEIGHT = (64, 64)
  if (imgWidth > imgHeight) & (imgWidth != MAXWIDTH) :
    imgHeight = round(imgHeight * MAXWIDTH / imgWidth)
    imgWidth = MAXWIDTH
  elif (imgHeight > imgWidth) & (imgHeight != MAXHEIGHT) :
    imgWidth = round(imgWidth * MAXHEIGHT / imgHeight)
    imgHeight = MAXHEIGHT
  
  image = image.resize((imgWidth, imgHeight), Image.BILINEAR)
  print("after resize: {} {}".format(imgWidth, imgHeight))

  """
  # 裁切長型圖片
  if imgHeight > imgWidth :
    image = image.crop((0, 0, imgWidth, imgWidth))  # (left, upper, right, lower)
    imgWidth, imgHeight = image.size
    print("after crop: {} {}".format(imgWidth, imgHeight))
  """

  # Reducing Quality
  #quality_val = 90

  #image.show()
  image.save(outpath, "png")

"""
================= load images list ==================
"""
monsters = pd.read_csv("monsters.csv", encoding="utf-8")
monsters = monsters.filter(items=["ID", "img"], axis=1)
monsters = monsters.drop_duplicates()

images = pd.read_csv("images.csv", encoding="utf-8")
images = images.join(monsters.set_index("ID"), on="roId")

start_time = datetime.datetime.now()
print("Ready to download {} monsters image...{}".format(len(images), start_time))

"""
================= download images ==================
"""
dest_dir = "../public/static/images/"
headers = {
    "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Encoding" : "gzip, deflate, br",
    "Accept-Language" : "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
    "Connection" : "keep-alive",
    "DNT" : "1",
    "Host" : "nn.ai4rei.net",
    "Sec-Fetch-Dest" : "document",
    "Sec-Fetch-Mode" : "navigate",
    "Sec-Fetch-Site" : "none",
    "Sec-Fetch-User" : "?1",
    "Upgrade-Insecure-Requests" : "1",
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0"
    }
session = requests.session()
host = "https://nn.ai4rei.net/dev/npclist/"
data = session.get("{}?qq=all".format(host)).text
soup = BeautifulSoup(data, "html.parser")

failed_list = pd.DataFrame()
for row in images.itertuples(index=False) :
  outpath = os.path.join(dest_dir, row.image)
  
  if os.path.isfile(outpath) :
    print("{}'s image exist".format(row.roId))
  else :
    item = soup.select("#tagme_{}".format(row.roId))

    if len(item) > 0 :
      img_url = "{}{}".format(host, item[0].find_previous_sibling("img").attrs["src"])
      print("Download {}'s image, {}".format(row.roId, img_url))
      res = session.get(img_url, headers=headers)
    else :
      print("Failed, try to download from rd.fharr.com".format(row.roId))
      print("Download {}'s image, {}".format(row.roId, row.img))
      res = session.get(row.img)

    reduce_and_save_image(res.content, outpath)
    sleep(1)

end_time = datetime.datetime.now()
print("Download finished at {}, it takes {} seconds".format(end_time, (end_time - start_time).total_seconds()))