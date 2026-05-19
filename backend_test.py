#!/usr/bin/env python3
"""
Backend API Testing for AgriScan AI
Tests all backend endpoints in priority order
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "https://crop-health-scan-21.preview.emergentagent.com/api"
TEST_EMAIL = "test_agriscan@example.com"
TEST_PASSWORD = "testpassword123"
TEST_DISPLAY_NAME = "Agriculteur Test"
TEST_FARM_NAME = "Ferme Test"

# Global variables to store test data
test_user_uid = None
test_diagnostic_id = None

def print_test_header(test_name):
    """Print formatted test header"""
    print("\n" + "="*80)
    print(f"TEST: {test_name}")
    print("="*80)

def print_result(success, message, response=None):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    if response:
        print(f"Response Status: {response.status_code}")
        try:
            print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response Text: {response.text}")
    print("-"*80)

# ============= HIGH PRIORITY TESTS =============

def test_signup():
    """Test POST /api/auth/signup"""
    global test_user_uid
    print_test_header("1. POST /api/auth/signup - Create User Account")
    
    try:
        # First, try to delete existing test user if any
        # (This is just for cleanup, ignore errors)
        
        payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "display_name": TEST_DISPLAY_NAME,
            "farm_name": TEST_FARM_NAME
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "uid" in data and data["email"] == TEST_EMAIL:
                test_user_uid = data["uid"]
                print_result(True, f"User created successfully with UID: {test_user_uid}", response)
                return True
            else:
                print_result(False, "Response missing required fields", response)
                return False
        elif response.status_code == 400 and "already exists" in response.text.lower():
            print_result(True, "User already exists (acceptable for testing)", response)
            # Try to login to get the UID
            return test_login()
        else:
            print_result(False, f"Unexpected status code: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_login():
    """Test POST /api/auth/login"""
    global test_user_uid
    print_test_header("2. POST /api/auth/login - Login with Credentials")
    
    try:
        payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "uid" in data and data["email"] == TEST_EMAIL:
                test_user_uid = data["uid"]
                print_result(True, f"Login successful with UID: {test_user_uid}", response)
                return True
            else:
                print_result(False, "Response missing required fields", response)
                return False
        else:
            print_result(False, f"Login failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_diagnostic():
    """Test POST /api/diagnostics?user_id={uid}"""
    global test_diagnostic_id
    print_test_header("3. POST /api/diagnostics - Create Diagnostic")
    
    if not test_user_uid:
        print_result(False, "Cannot test: No user UID available (signup/login failed)")
        return False
    
    try:
        payload = {
            "culture": "Tomates",
            "symptoms": "Feuilles jaunissantes avec taches brunes"
        }
        
        response = requests.post(
            f"{BASE_URL}/diagnostics",
            params={"user_id": test_user_uid},
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["culture"] == "Tomates":
                test_diagnostic_id = data["id"]
                print_result(True, f"Diagnostic created with ID: {test_diagnostic_id}", response)
                return True
            else:
                print_result(False, "Response missing required fields", response)
                return False
        else:
            print_result(False, f"Failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_chat_ai():
    """Test POST /api/chat?user_id={uid} - AI Chat with GPT-5.2"""
    print_test_header("4. POST /api/chat - Send Message to AI Chatbot (GPT-5.2)")
    
    if not test_user_uid:
        print_result(False, "Cannot test: No user UID available")
        return False
    
    if not test_diagnostic_id:
        print_result(False, "Cannot test: No diagnostic ID available")
        return False
    
    try:
        payload = {
            "diagnostic_id": test_diagnostic_id,
            "message": "Quelles sont les causes possibles?"
        }
        
        response = requests.post(
            f"{BASE_URL}/chat",
            params={"user_id": test_user_uid},
            json=payload,
            timeout=30  # Longer timeout for AI response
        )
        
        if response.status_code == 200:
            data = response.json()
            if "content" in data and "role" in data and data["role"] == "assistant":
                print_result(True, f"AI responded successfully. Response length: {len(data['content'])} chars", response)
                return True
            else:
                print_result(False, "Response missing required fields", response)
                return False
        else:
            print_result(False, f"Failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============= MEDIUM PRIORITY TESTS =============

def test_get_diagnostics():
    """Test GET /api/diagnostics/{user_id}"""
    print_test_header("5. GET /api/diagnostics/{user_id} - Get All Diagnostics")
    
    if not test_user_uid:
        print_result(False, "Cannot test: No user UID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/diagnostics/{test_user_uid}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_result(True, f"Retrieved {len(data)} diagnostic(s)", response)
                return True
            else:
                print_result(False, "Response is not a list", response)
                return False
        else:
            print_result(False, f"Failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_get_stats():
    """Test GET /api/stats/{user_id}"""
    print_test_header("6. GET /api/stats/{user_id} - Get Dashboard Statistics")
    
    if not test_user_uid:
        print_result(False, "Cannot test: No user UID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/stats/{test_user_uid}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["total_diagnostics", "status_breakdown", "unread_alerts"]
            if all(field in data for field in required_fields):
                print_result(True, f"Stats retrieved: {data['total_diagnostics']} total diagnostics", response)
                return True
            else:
                print_result(False, "Response missing required fields", response)
                return False
        else:
            print_result(False, f"Failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_alert():
    """Test POST /api/alerts?user_id={uid}"""
    print_test_header("7. POST /api/alerts - Create Alert")
    
    if not test_user_uid:
        print_result(False, "Cannot test: No user UID available")
        return False
    
    try:
        payload = {
            "type": "maladie",
            "message": "Test alerte",
            "severity": "warning"
        }
        
        response = requests.post(
            f"{BASE_URL}/alerts",
            params={"user_id": test_user_uid},
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["message"] == payload["message"]:
                print_result(True, f"Alert created with ID: {data['id']}", response)
                return True
            else:
                print_result(False, "Response missing required fields", response)
                return False
        else:
            print_result(False, f"Failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_get_alerts():
    """Test GET /api/alerts/{user_id}"""
    print_test_header("8. GET /api/alerts/{user_id} - Get Alerts")
    
    if not test_user_uid:
        print_result(False, "Cannot test: No user UID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/alerts/{test_user_uid}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_result(True, f"Retrieved {len(data)} alert(s)", response)
                return True
            else:
                print_result(False, "Response is not a list", response)
                return False
        else:
            print_result(False, f"Failed with status: {response.status_code}", response)
            return False
            
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============= MAIN TEST RUNNER =============

def run_all_tests():
    """Run all tests in priority order"""
    print("\n" + "="*80)
    print("AGRISCAN AI - BACKEND API TESTING")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    results = {}
    
    # HIGH PRIORITY TESTS
    print("\n" + "#"*80)
    print("# HIGH PRIORITY TESTS")
    print("#"*80)
    
    results["signup"] = test_signup()
    results["login"] = test_login()
    results["create_diagnostic"] = test_create_diagnostic()
    results["chat_ai"] = test_chat_ai()
    
    # MEDIUM PRIORITY TESTS
    print("\n" + "#"*80)
    print("# MEDIUM PRIORITY TESTS")
    print("#"*80)
    
    results["get_diagnostics"] = test_get_diagnostics()
    results["get_stats"] = test_get_stats()
    results["create_alert"] = test_create_alert()
    results["get_alerts"] = test_get_alerts()
    
    # SUMMARY
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%\n")
    
    print("Detailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")
    
    print("\n" + "="*80)
    
    return results

if __name__ == "__main__":
    run_all_tests()
