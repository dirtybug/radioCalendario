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

@pytest.fixture(scope="session")
def browser():
    # Initialize the database and register the user
    init_db()
    delete_user("admin@admnin.pw")  # Remove the test user
    register_user("admin@admnin.pw", "password")

    # Set up the Edge WebDriver
    driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))

    driver.maximize_window()

    # Log in before running tests
    driver.get(BASE_URL)
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "toggleLogin"))).click()

    # Wait for the username input field to be visible
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "username")))

    # Fill in the login form
    driver.find_element(By.ID, "username").send_keys("admin@admnin.pw")
    driver.find_element(By.ID, "password").send_keys("password")
    driver.find_element(By.ID, "login").submit()  # Submit the login form

    yield driver  # The browser instance will stay open for all tests

    # Cleanup: Delete the user after all tests are done
    #delete_user("admin@admnin.pw")  # Remove the test user
    driver.quit()  # This will run after all tests are done



def test_add_event(browser):
    # Open the web application
    browser.get(BASE_URL)



    # Wait for the form to become visible

    form = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "newEventForm"))  # Wait for the form by ID
    )
    print("Form is visible.")


    # Wait for the name input field to be clickable
    name_input = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.ID, "name"))
    )
    name_input.send_keys("Test Event")

    # Continue filling out the rest of the form
    type_select = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.ID, "type"))
    )
    type_select.send_keys("online")  # Select type

    frequency_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "frequencia"))
    )
    frequency_input.send_keys("2m")  # Example frequency

    modulation_select = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.ID, "modulacao"))
    )
    modulation_select.send_keys("ssb")  # Select modulation

    canal_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "canal"))
    )
    canal_input.send_keys("145.500")  # Example canal

    # Set date and time
    date_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "date"))
    )
    date_input.send_keys("2024-11-02")  # Format YYYY-MM-DD

    time_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "time"))
    )
    time_input.send_keys("10:00")  # Format HH:MM

    end_date_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "endDate"))
    )
    end_date_input.send_keys("2024-11-02")  # Format YYYY-MM-DD

    end_time_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "endTime"))
    )
    end_time_input.send_keys("12:00")  # Format HH:MM

    # Fill in the responsible entity
    entity_input = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "entity"))
    )
    entity_input.send_keys("Radio Club XYZ")  # Example entity

    # Fill in the description
    description_textarea = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "description"))
    )
    description_textarea.send_keys("This is a test event description.")  # Example description

    # Submit the form
    submit_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
    )
    submit_button.click()

    # Optionally, add assertions here to verify that the event was added successfully


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
