import pytest

@pytest.fixture(scope="session")
def base_url():
    return "http://localhost:3000"  # Replace with your actual domain
