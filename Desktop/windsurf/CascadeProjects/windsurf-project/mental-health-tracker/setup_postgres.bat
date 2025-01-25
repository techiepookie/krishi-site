@echo off
echo Creating PostgreSQL database for Mental Health Tracker...

REM Create database
createdb mentalhealth

echo Database 'mentalhealth' created successfully!
echo.
echo Please update the .env file with your PostgreSQL credentials:
echo DATABASE_URL=postgresql://username:password@localhost/mentalhealth
echo.
