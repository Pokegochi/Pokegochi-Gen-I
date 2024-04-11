@echo off
setlocal enabledelayedexpansion
set /a count=1
for %%a in (*.png) do (
    ren "%%a" "!count!.png"
    set /a count+=1
)