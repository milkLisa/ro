"""
從monsters.csv的img url下載圖檔,
並縮小成max 64*64 pixel,
再轉存png格式至public/static/images資料夾
Updated: 2023/09/24
"""
from time import sleep
from PIL import Image
import pandas as pd
import requests
import datetime
import os
import io

monsters = pd.read_csv("monsters.csv", encoding="utf-8")
monsters = monsters.filter(items=["ID", "img"], axis=1)
monsters = monsters.drop_duplicates()

images = pd.read_csv("images.csv", encoding="utf-8")
images.columns = ["ID", "image"]
images = images.join(monsters.set_index("ID"), on="ID")

start_time = datetime.datetime.now()
print("Ready to download {} monsters image...{}".format(len(images), start_time))

for row in images.itertuples(index=False) :
  outpath = os.path.join("../public/static/images/", row.image)

  if os.path.isfile(outpath) :
    print("{}'s image exist".format(row.ID))
  else :
    print("Download {}'s image, {}".format(row.ID, row.img))
    
    image = requests.get(row.img)
    """
    with open(outpath, "wb") as outfile:
      outfile.write(image.content)
    """

    ###### 用Pillow處理圖片才存檔 ######
    image = Image.open(io.BytesIO(image.content))
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
    
    sleep(1)

end_time = datetime.datetime.now()
print("Download finished at {}, it takes {} seconds".format(end_time, (end_time - start_time).total_seconds()))