@echo off
echo ========================================
echo 商家管理系统启动脚本
echo ========================================
echo.

echo 1. 启动后端服务器...
cd merchant-system
start "后端服务器" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo 2. 启动前端应用...
cd ../merchant-vue
start "前端应用" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo 系统启动完成！
echo ========================================
echo 后端地址: http://localhost:3000
echo 前端地址: http://localhost:5173
echo 健康检查: http://localhost:3000/health
echo.
echo 演示账号:
echo - 管理员: admin1 / 123456
echo - 普通用户: user2 / 123456  
echo - 商家A: 商户A / 123456
echo - 商家B: 商户B / 123456
echo ========================================
pause 