"""
Test script for Alerts Geolocation Support
- POST /api/alerts with latitude/longitude/location_name
- POST /api/alerts without location fields (backwards compat)
- GET /api/alerts/{user_id} returns location fields when set
"""
import os
import requests
import json
from pathlib import Path

# Read external backend URL from frontend .env
BACKEND_URL = None
env_file = Path("/app/frontend/.env")
for line in env_file.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        BACKEND_URL = line.split("=", 1)[1].strip().strip('"')
        break

API = f"{BACKEND_URL}/api"
print(f"Using backend: {API}")

USER_ID = "d7859780-639c-47cd-b264-6a466bd8e9e9"
EMAIL = "test_agriscan@example.com"
PASSWORD = "testpassword123"

results = []

def record(name, ok, details=""):
    results.append((name, ok, details))
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name} - {details}")

# 0. Verify user exists / login
r = requests.post(f"{API}/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=30)
if r.status_code != 200:
    print(f"Login failed: {r.status_code} {r.text}")
    raise SystemExit(1)
user = r.json()
uid = user["uid"]
print(f"Logged in. UID: {uid}")
record("Auth login (precheck)", uid == USER_ID, f"uid={uid}")

# 1. POST /api/alerts WITH location fields
body_with_loc = {
    "type": "maladie",
    "message": "Mildiou détecté sur tomates - Toulouse",
    "severity": "critical",
    "latitude": 43.6047,
    "longitude": 1.4442,
    "location_name": "Toulouse"
}
r = requests.post(f"{API}/alerts?user_id={uid}", json=body_with_loc, timeout=30)
print(f"\nPOST /alerts (with loc) -> {r.status_code}")
print(f"Body: {r.text[:500]}")

if r.status_code == 200:
    data = r.json()
    record("POST /api/alerts returns 200 (with location)", True, f"id={data.get('id')}")
    # Check fields
    has_lat = data.get("latitude") == 43.6047
    has_lon = data.get("longitude") == 1.4442
    has_name = data.get("location_name") == "Toulouse"
    record("Response contains latitude=43.6047", has_lat, f"got={data.get('latitude')}")
    record("Response contains longitude=1.4442", has_lon, f"got={data.get('longitude')}")
    record("Response contains location_name=Toulouse", has_name, f"got={data.get('location_name')}")
    alert_with_loc_id = data.get("id")
else:
    record("POST /api/alerts returns 200 (with location)", False, f"status={r.status_code} body={r.text[:300]}")
    record("Response contains latitude=43.6047", False, "request failed")
    record("Response contains longitude=1.4442", False, "request failed")
    record("Response contains location_name=Toulouse", False, "request failed")
    alert_with_loc_id = None

# 2. POST /api/alerts WITHOUT location fields (backwards compat)
body_no_loc = {
    "type": "météo",
    "message": "Risque de gel ce soir",
    "severity": "warning"
}
r = requests.post(f"{API}/alerts?user_id={uid}", json=body_no_loc, timeout=30)
print(f"\nPOST /alerts (no loc) -> {r.status_code}")
print(f"Body: {r.text[:500]}")

if r.status_code == 200:
    data = r.json()
    record("POST /api/alerts returns 200 (no location)", True, f"id={data.get('id')}")
    lat_null = data.get("latitude") is None
    lon_null = data.get("longitude") is None
    name_null = data.get("location_name") is None
    record("Response latitude is null when omitted", lat_null, f"got={data.get('latitude')}")
    record("Response longitude is null when omitted", lon_null, f"got={data.get('longitude')}")
    record("Response location_name is null when omitted", name_null, f"got={data.get('location_name')}")
    alert_no_loc_id = data.get("id")
else:
    record("POST /api/alerts returns 200 (no location)", False, f"status={r.status_code} body={r.text[:300]}")
    record("Response latitude is null when omitted", False, "request failed")
    record("Response longitude is null when omitted", False, "request failed")
    record("Response location_name is null when omitted", False, "request failed")
    alert_no_loc_id = None

# 3. GET /api/alerts/{user_id}
r = requests.get(f"{API}/alerts/{uid}", timeout=30)
print(f"\nGET /alerts/{uid} -> {r.status_code}")
if r.status_code == 200:
    alerts = r.json()
    print(f"Got {len(alerts)} alerts")
    record("GET /api/alerts returns 200", True, f"count={len(alerts)}")
    # Find the alerts we just created
    if alert_with_loc_id:
        found = next((a for a in alerts if a.get("id") == alert_with_loc_id), None)
        if found:
            ok = (found.get("latitude") == 43.6047
                  and found.get("longitude") == 1.4442
                  and found.get("location_name") == "Toulouse")
            record("GET alerts includes location fields for geo-tagged alert", ok,
                   f"lat={found.get('latitude')} lon={found.get('longitude')} name={found.get('location_name')}")
        else:
            record("GET alerts includes location fields for geo-tagged alert", False, "alert not found in list")
    if alert_no_loc_id:
        found = next((a for a in alerts if a.get("id") == alert_no_loc_id), None)
        if found:
            ok = (found.get("latitude") is None
                  and found.get("longitude") is None
                  and found.get("location_name") is None)
            record("GET alerts: location fields null for non-geo alert", ok,
                   f"lat={found.get('latitude')} lon={found.get('longitude')} name={found.get('location_name')}")
        else:
            record("GET alerts: location fields null for non-geo alert", False, "alert not found")
else:
    record("GET /api/alerts returns 200", False, f"status={r.status_code}")

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
passed = sum(1 for _, ok, _ in results if ok)
total = len(results)
for name, ok, details in results:
    status = "PASS" if ok else "FAIL"
    print(f"  [{status}] {name}")
print(f"\n{passed}/{total} assertions passed")
