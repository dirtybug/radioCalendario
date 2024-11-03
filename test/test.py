import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from database import init_db, register_user, delete_user
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Define the base URL globally in this file
BASE_URL = "http://localhost:4000"  # Replace with your actual base URL
TEST_USER_EMAIL = "admin@admnin.pw"
TEST_USER_PASSWORD = "password"
EVENT_NAME = "Test Event"
ENTITY_NAME = "Radio Club XYZ"

@pytest.fixture(scope="session")
def browser():
    # Initialize the database and register the user
    init_db()
    delete_user(TEST_USER_EMAIL)  # Remove the test user if it exists
    register_user(TEST_USER_EMAIL, TEST_USER_PASSWORD)

    # Set up the Edge WebDriver
    driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))
    driver.maximize_window()

    # Log in before running tests
    driver.get(BASE_URL)

    # Wait for the login toggle button and click it
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "toggleLogin"))).click()
    
    # Wait for the login form to be visible
    login_form = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "login"))
    )

    # Locate and fill in the username and password
    username_input = login_form.find_element(By.ID, "username")
    username_input.send_keys(TEST_USER_EMAIL)

    password_input = login_form.find_element(By.ID, "password")
    password_input.send_keys(TEST_USER_PASSWORD)

    # Submit the login form
    submit_button = login_form.find_element(By.XPATH, ".//button[@type='submit']")
    submit_button.click()
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "eventForm"))  # Wait for the new form to be visible
    )


    yield driver  # The browser instance will stay open for all tests

    # Cleanup: Delete the user after all tests are done
    delete_user(TEST_USER_EMAIL)  # Remove the test user
    driver.quit()  # Close the browser

def test_add_event(browser):
    # Open the web application
    browser.get(BASE_URL)

    # Wait for the event creation form to become visible
    form = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "newEventForm"))
    )
    print("Event form is visible.")

    # Fill out the event creation form
    browser.find_element(By.ID, "name").send_keys(EVENT_NAME)
    browser.find_element(By.ID, "type").send_keys("online")
    browser.find_element(By.ID, "frequencia").send_keys("2m")
    browser.find_element(By.ID, "modulacao").send_keys("ssb")
    browser.find_element(By.ID, "canal").send_keys("145.500")
    browser.find_element(By.ID, "date").send_keys("2025-11-02")
    browser.find_element(By.ID, "time").send_keys("10:00")
    browser.find_element(By.ID, "endDate").send_keys("2025-11-02")
    browser.find_element(By.ID, "endTime").send_keys("12:00")
    browser.find_element(By.ID, "entity").send_keys(ENTITY_NAME)
    browser.find_element(By.ID, "description").send_keys("This is a test event description.")

    # Submit the event creation form
    submit_button = browser.find_element(By.XPATH, "//button[@type='submit']")
    submit_button.click()

    # Validate that the event was added successfully
    

def test_delete_event(browser):
    # Open the web application
    browser.get(BASE_URL)

    # Find and delete the event
    delete_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//tr[td[contains(text(), '{EVENT_NAME}')]]//button[contains(text(), 'Delete')]"))
    )
    delete_button.click()

    


def test_event_validation(browser):
    # Open the web application
    browser.get(BASE_URL)

    # Attempt to submit without required fields
    submit_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.ID, "submit-button"))  # Adjust the selector as needed
    )
    submit_button.click()


