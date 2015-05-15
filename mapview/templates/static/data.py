import random
out = file('data.js','w')
out.write('var points =[\n')
delta=0.02
day = 10
pointnumber = 100


def lng():
    return random.uniform(116.40-delta, 116.44+delta)
def lat():
    return random.uniform(39.90-delta, 39.95+delta)
def count():
    return int(random.uniform(1, 100))
for i in range(0,day):
    out.write('[')
    for j in range(0,pointnumber):
        out.write('''{"lng":%f,"lat":%f,"count":%d},\n'''%(lng(),lat(),count()))
    out.write('],\n')
        
        
out.write(']')
out.close()
