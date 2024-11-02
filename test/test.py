import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from database import init_db, register_user, delete_user
from webdriver_manager.microsoft import EdgeChromiumDriverManager

@pytest.fixture(scope="module")
def browser():
    init_db()
    register_user("admin@admnin.pw", "password")

    driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))
    driver.maximize_window()
    yield driver
    driver.quit()

def test_add_event(browser, base_url):
    # Open the web application
    browser.get(base_url)

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

def test_delete_event(browser, base_url):
    # Assume the event is already created from the previous test or manually
    # Open the web application
    browser.get(base_url)

    # Find and delete the event
    delete_button = browser.find_element(By.XPATH, "//tr[td[contains(text(), 'Test Event')]]//button[contains(text(), 'Delete')]")
    delete_button.click()  # Adjust the selector as needed

    # Verify that the event is deleted
    assert "Test Event" not in browser.page_source

def test_event_validation(browser, base_url):
    # Open the web application
    browser.get(base_url)

    # Attempt to submit without required fields
    browser.find_element(By.ID, "submit-button").click()  # Adjust the selector as needed

    # Check for error message
    assert "Please fill out this field" in browser.page_source  # Adjust this based on your actual error handling
