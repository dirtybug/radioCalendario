import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from database import init_db, register_user, delete_user
from webdriver_manager.microsoft import EdgeChromiumDriverManager

# Define the base URL globally in this file
BASE_URL = "http://localhost:4000"  # Replace with your actual base URL

@pytest.fixture(scope="session")
def browser():
    # Initialize the database and register the user
/*************  ✨ Codeium Command ⭐  *************/
    """
    Fixture that sets up the browser and logs in before tests are run.

    Initializes the database, registers the test user, sets up the Edge WebDriver,
    logs in, and then yields the browser instance to the test functions.

    After all tests are run, the fixture cleans up by deleting the test user and
    closing the browser instance.
    """
/******  b367b9f3-95dc-442b-960c-54adf624d5cd  *******/
    init_db()
    register_user("admin@admnin.pw", "password")

    # Set up the Edge WebDriver
    driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))
    driver.maximize_window()

    # Log in before running tests
    driver.get(BASE_URL)

    # Fill in the login form
    driver.find_element(By.ID, "username").send_keys("admin@admnin.pw")
    driver.find_element(By.ID, "password").send_keys("password")
    driver.find_element(By.ID, "login").submit()  # Submit the login form

    yield driver  # The browser instance will stay open for all tests

    # Cleanup: Delete the user after all tests are done
    delete_user("admin@admnin.pw")  # Remove the test user
    driver.quit()  # This will run after all tests are done

def test_add_event(browser):
    # Open the web application
    browser.get(BASE_URL)

    # Fill in event details
    browser.find_element(By.NAME, "name").send_keys("Test Event")
    browser.find_element(By.NAME, "type").send_keys("online")
    browser.find_element(By.NAME, "mode").send_keys("ssb")
    browser.find_element(By.NAME, "frequency").send_keys("145.500")
    browser.find_element(By.NAME, "dmrChannel").send_keys("1")
    browser.find_element(By.NAME, "date").send_keys("2024-11-02")  # Use the appropriate date format
    browser.find_element(By.NAME, "enddate").send_keys("2024-11-02")  # Use the appropriate end date format
    browser.find_element(By.NAME, "entity").send_keys("Test Entity")
    browser.find_element(By.NAME, "description").send_keys("This is a test event.")

    # Submit the form
    browser.find_element(By.ID, "submit-button").click()  # Adjust the selector as needed

    # Check that the event was added
    assert "Test Event" in browser.page_source

def test_delete_event(browser):
    # Open the web application
    browser.get(BASE_URL)

    # Find and delete the event
    delete_button = browser.find_element(By.XPATH, "//tr[td[contains(text(), 'Test Event')]]//button[contains(text(), 'Delete')]")
    delete_button.click()  # Adjust the selector as needed

    # Verify that the event is deleted
    assert "Test Event" not in browser.page_source

def test_event_validation(browser):
    # Open the web application
    browser.get(BASE_URL)

    # Attempt to submit without required fields
    browser.find_element(By.ID, "submit-button").click()  # Adjust the selector as needed

    # Check for error message
    assert "Please fill out this field" in browser.page_source  # Adjust this based on your actual error handling
