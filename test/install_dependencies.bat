@echo off
:: Create a virtual environment if needed
python -m venv venv

:: Activate the virtual environment
call venv\Scripts\activate

:: Install necessary Python packages
pip install selenium
pip install pytest
pip install webdriver-manager

:: Notify completion
echo Dependencies have been installed. You can now run the tests using pytest.
pause
