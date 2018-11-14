# unTexturePacker
unTexturePacker: cut the atlas  with josn or plist （切割TexturePacker合成的图集）

if you are a game devoloper in h5,you may use cocos , layar or egret .usually，you often pack image to atlas with TexturePacker.
but sometime you need to cut the atlsa to small image with json or plist. this project can cut it with node.js

how to use      
    type "node unPacker xxx.json" or type "node unPacker xxx.plist".
    
      eg. type  "node unPacker gameUI.json", it will creat a folde named gameUI and the image cutted will be put in this folder.
  
  before this,you need to type "npm install"
