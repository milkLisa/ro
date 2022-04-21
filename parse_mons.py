
from bs4 import BeautifulSoup
import re
import pandas as pd

result = pd.read_csv('monsters.csv', encoding='utf-8')
print('1. result length {}'.format(len(result)))

result = result[result['time'].notna() & result['time'].str.contains(r'^\d+.?[天|時|分]')]
#result = result[result['time'].isna() | (result['time'].str.contains(r'即時')==False)]
print('2. result length {}'.format(len(result)))

#增加isMVP欄位
result = result.assign(isMVP=result['名稱'].str.count('[M]')==True)

#修改無意義的值
result['名稱'] = result["名稱"].apply(lambda x: x[re.search(r'\[M?B?\]\s', x).end():])
result = result.replace({'img': r'null.gif'}, {'img': pd.NA}, regex=True)
result = result.replace({'floor': r'隨機'}, {'floor': pd.NA}, regex=True)

#結合地圖與樓層資訊
result['location'] = result['location'] + result["floor"].apply(lambda x: ' ' + x if pd.notna(x) else '')

#只取需要的欄位
result = result.filter(items=['ID', 'isMVP','名稱','Lv↑','種族','屬性','體型', 'img', 'location', 'time'], axis=1)

#自訂欄位名稱
result.columns = ['fthId', 'isMVP', 'name', 'level', 'race', 'element', 'size', 'image', 'location', 'time']

#重設index為fthId
#result = result.set_index('fthId')
#print(len(result))
#result.to_json('monsters.json', orient='index', force_ascii=False)
result = result.sort_values(by=['isMVP', 'level', 'fthId', 'time', 'location'])
result.to_json('monsters.json', orient='records', force_ascii=False)