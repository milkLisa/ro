from time import sleep
import requests
import pandas as pd

monsters = {"boss": {"v": 2, "pages": 6}, "mvp": {"v": 3, "pages": 5}}
url_template = "https://rd.fharr.com/moblist?v={}&g=1&page={}"

result = pd.DataFrame()
for monster in monsters :
  print("load {}...".format(monster))
  pages = monsters[monster]["pages"]

  for page in range(1, pages + 1) :
    print("page {}".format(page))
    url = url_template.format(monsters[monster]["v"], page)
    data = pd.read_html(requests.get(url).text)[0]
    result = pd.concat([result, data], ignore_index=True)
    sleep(1)

print("write to file monsters.html")
result.to_html("monsters.html", index=False)