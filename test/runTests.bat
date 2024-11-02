@echo off
:: Activate the virtual environment if it exists, else display a message
if exist venv (
    call venv\Scripts\activate
) else (
    echo Virtual environment not found. Please run install_dependencies.bat first.
    exit /b
)

:: Run the tests using pytest
echo Running the tests...
pytest test.py --maxfail=1 --disable-warnings

:: Notify that the tests are complete
echo Tests completed. Press any key to close.
pause
