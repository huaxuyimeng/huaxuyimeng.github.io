#!/bin/bash
# 一键启动前后端服务

cd ./hou
npm install
echo "启动后端..."
npm run dev &
cd ../qian
npm install
echo "启动前端..."
npm run dev &
cd ..
echo "前后端启动完成，请分别访问："
echo "后端：http://localhost:3000"
echo "前端：http://localhost:5173" 