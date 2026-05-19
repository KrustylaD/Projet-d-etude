"""
Backend tests for AgriScan AI - User Profile Management endpoints
Tests PATCH /api/users/{uid} and PATCH /api/users/{uid}/password
"""
import sys
import requests
from datetime import datetime

BACKEND_URL = "https://crop-health-scan-21.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"

# Test credentials (from /app/memory/test_credentials.md)
TEST_EMAIL = "test_agriscan@example.com"
TEST_PASSWORD = "testpassword123"
TEST_UID = "8ec0cb00-919d-4d8b-871c-c077b0ce177a"

results = []


def ensure_test_user():
    """Ensure the test user exists in DB. If not, create via signup and update TEST_UID."""
    global TEST_UID
    # Try login first
    r = requests.post(f"{API_URL}/auth/login", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD
    })
    if r.status_code == 200:
        TEST_UID = r.json()["uid"]
        print(f"[INFO] Existing test user found. UID={TEST_UID}")
        return
    # else signup fresh
    r2 = requests.post(f"{API_URL}/auth/signup", json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "display_name": "Agriculteur Test",
        "farm_name": "Ferme Test",
    })
    if r2.status_code == 200:
        TEST_UID = r2.json()["uid"]
        print(f"[INFO] Created fresh test user. UID={TEST_UID}")
    else:
        # if email exists but credentials wrong, that's bad
        print(f"[ERROR] Could not create test user: {r2.status_code} {r2.text}")
        sys.exit(2)


def log(name, ok, info=""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name} {('| ' + info) if info else ''}")
    results.append({"name": name, "ok": ok, "info": info})


def test_login_returns_photo_url():
    r = requests.post(f"{API_URL}/auth/login", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD
    })
    ok = r.status_code == 200 and "photo_url" in r.json()
    log("Login returns photo_url field", ok, f"status={r.status_code}, photo_url={r.json().get('photo_url') if r.status_code==200 else 'N/A'}")


def test_get_user_returns_photo_url():
    r = requests.get(f"{API_URL}/users/{TEST_UID}")
    ok = r.status_code == 200 and "photo_url" in r.json()
    log("GET /users/{uid} returns photo_url field", ok, f"status={r.status_code}")


def test_signup_returns_photo_url():
    email = f"throwaway_{int(datetime.utcnow().timestamp())}@example.com"
    r = requests.post(f"{API_URL}/auth/signup", json={
        "email": email,
        "password": "throwawaypw123",
        "display_name": "Throwaway",
    })
    ok = r.status_code == 200 and "photo_url" in r.json()
    log("Signup response includes photo_url field", ok, f"status={r.status_code}")


def test_patch_single_field():
    new_name = "Agriculteur Test Modifié"
    r = requests.patch(f"{API_URL}/users/{TEST_UID}", json={"display_name": new_name})
    if r.status_code != 200:
        log("PATCH single field (display_name)", False, f"status={r.status_code} body={r.text[:200]}")
        return
    body = r.json()
    ok = body.get("display_name") == new_name and "photo_url" in body
    log("PATCH single field (display_name)", ok, f"returned name={body.get('display_name')}")
    g = requests.get(f"{API_URL}/users/{TEST_UID}")
    ok2 = g.status_code == 200 and g.json().get("display_name") == new_name
    log("Persistence verified for display_name", ok2, f"GET name={g.json().get('display_name')}")


def test_patch_photo_url_only():
    url = "https://cdn.example.com/avatars/agriculteur.png"
    r = requests.patch(f"{API_URL}/users/{TEST_UID}", json={"photo_url": url})
    ok = r.status_code == 200 and r.json().get("photo_url") == url
    log("PATCH photo_url only", ok, f"status={r.status_code}, photo_url={r.json().get('photo_url') if r.status_code==200 else 'N/A'}")


def test_patch_multiple_fields():
    payload = {
        "phone_number": "+33612345678",
        "farm_name": "Ferme des Oliviers",
        "location": "Provence, France",
        "photo_url": "https://example.com/photo.jpg",
    }
    r = requests.patch(f"{API_URL}/users/{TEST_UID}", json=payload)
    if r.status_code != 200:
        log("PATCH multiple fields", False, f"status={r.status_code} body={r.text[:200]}")
        return
    body = r.json()
    ok = all(body.get(k) == v for k, v in payload.items())
    log("PATCH multiple fields returns updated values", ok, f"body keys={list(body.keys())}")
    g = requests.get(f"{API_URL}/users/{TEST_UID}").json()
    ok2 = all(g.get(k) == v for k, v in payload.items())
    log("Persistence verified for multi-field update (re-fetch via GET)", ok2)


def test_patch_empty_body():
    r = requests.patch(f"{API_URL}/users/{TEST_UID}", json={})
    ok = r.status_code == 400
    log("PATCH empty body returns 400", ok, f"status={r.status_code}, body={r.text[:120]}")


def test_patch_nonexistent_uid():
    fake_uid = "00000000-0000-0000-0000-000000000000"
    r = requests.patch(f"{API_URL}/users/{fake_uid}", json={"display_name": "X"})
    ok = r.status_code == 404
    log("PATCH non-existent uid returns 404", ok, f"status={r.status_code}")


def test_password_wrong_old():
    r = requests.patch(f"{API_URL}/users/{TEST_UID}/password", json={
        "old_password": "wrongpassword!",
        "new_password": "irrelevant123",
    })
    ok = r.status_code == 401
    log("PATCH password wrong old_password returns 401", ok, f"status={r.status_code}")


def test_password_nonexistent_uid():
    fake_uid = "00000000-0000-0000-0000-000000000000"
    r = requests.patch(f"{API_URL}/users/{fake_uid}/password", json={
        "old_password": "any", "new_password": "anyother"
    })
    ok = r.status_code == 404
    log("PATCH password non-existent uid returns 404", ok, f"status={r.status_code}")


def test_password_change_and_login():
    new_pw = "newpass_temp_4567"
    r = requests.patch(f"{API_URL}/users/{TEST_UID}/password", json={
        "old_password": TEST_PASSWORD, "new_password": new_pw
    })
    ok = r.status_code == 200
    log("PATCH password change OK", ok, f"status={r.status_code} body={r.text[:120]}")

    r1 = requests.post(f"{API_URL}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    ok1 = r1.status_code == 401
    log("Login with OLD password fails after change", ok1, f"status={r1.status_code}")

    r2 = requests.post(f"{API_URL}/auth/login", json={"email": TEST_EMAIL, "password": new_pw})
    ok2 = r2.status_code == 200
    log("Login with NEW password succeeds", ok2, f"status={r2.status_code}")

    r3 = requests.patch(f"{API_URL}/users/{TEST_UID}/password", json={
        "old_password": new_pw, "new_password": TEST_PASSWORD
    })
    ok3 = r3.status_code == 200
    log("Restore original password", ok3, f"status={r3.status_code}")

    r4 = requests.post(f"{API_URL}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    ok4 = r4.status_code == 200
    log("Login with ORIGINAL password after restore", ok4, f"status={r4.status_code}")


def restore_profile_fields():
    r = requests.patch(f"{API_URL}/users/{TEST_UID}", json={
        "display_name": "Agriculteur Test",
        "farm_name": "Ferme Test",
    })
    log("Restore default display_name/farm_name", r.status_code == 200, f"status={r.status_code}")


if __name__ == "__main__":
    print(f"Backend URL: {API_URL}")
    ensure_test_user()
    print(f"Test UID: {TEST_UID}\n")
    print("=" * 60)
    print("PRE-CHECKS")
    print("=" * 60)
    test_login_returns_photo_url()
    test_get_user_returns_photo_url()
    test_signup_returns_photo_url()

    print("\n" + "=" * 60)
    print("PATCH /api/users/{uid}")
    print("=" * 60)
    test_patch_single_field()
    test_patch_photo_url_only()
    test_patch_multiple_fields()
    test_patch_empty_body()
    test_patch_nonexistent_uid()

    print("\n" + "=" * 60)
    print("PATCH /api/users/{uid}/password")
    print("=" * 60)
    test_password_wrong_old()
    test_password_nonexistent_uid()
    test_password_change_and_login()

    print("\n" + "=" * 60)
    print("CLEANUP")
    print("=" * 60)
    restore_profile_fields()

    print("\n" + "=" * 60)
    total = len(results)
    passed = sum(1 for r in results if r["ok"])
    print(f"RESULT: {passed}/{total} tests passed")
    print("=" * 60)
    sys.exit(0 if passed == total else 1)
